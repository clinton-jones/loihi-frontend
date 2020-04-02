import config from '../mainnet.config.json'

const loihiAddress = config.LOIHI

export const selectiveDeposit = async function () {
    const { store } = this.props
    const web3 = store.get('web3')
    const loihi = store.get('loihiObject')
    const walletAddress = store.get('walletAddress')

    const contracts = []
    const addresses = []
    const amounts = []

    if (store.get('daiDepositAmount') > 0){
        const daiObject = store.get('daiObject')
        contracts.push(daiObject)
        addresses.push(daiObject.options.address)
        amounts.push(store.get('daiDepositAmount').mul(10**18).toFixed())
    } 

    if (store.get('usdcDepositAmount') > 0) {
        const usdcObject = store.get('usdcObject')
        contracts.push(usdcObject)
        addresses.push(usdcObject.options.address)
        amounts.push(store.get('usdcDepositAmount').mul(10**6).toFixed())
    }

    if (store.get('usdtDepositAmount') > 0) {
        const usdtObject = store.get('usdtObject')
        contracts.push(usdtObject)
        addresses.push(usdtObject.options.address)
        amounts.push(store.get('usdtDepositAmount').mul(10**6).toFixed())
        console.log("amount", amounts[amounts.length - 1])
    }

    if (store.get('susdDepositAmount') > 0) {
        const susdObject = store.get('susdObject')
        contracts.push(susdObject)
        addresses.push(susdObject.options.address)
        amounts.push(store.get('susdDepositAmount').mul(10**18).toFixed())
    }

    console.log("amounts", amounts)
    console.log("loihiAddress", loihiAddress)
    const gasPrice = await web3.eth.getGasPrice()
    console.log("gas price", gasPrice)

    console.log("CONTRACTS", contracts)
    console.log("AMOUNTS", amounts)
    console.log("ADDRESSES", addresses)

    return senseApprovals()
        .then(assureApprovals)
        .then(doDeposit)
        .then(complete)
        .catch(triage)

    function senseApprovals () {
        return Promise.all(contracts.map(contract => {
            return contract.methods.allowance(walletAddress, loihiAddress).call()
        }))
    }


    function assureApprovals (approvals) {
        console.log("approvals", approvals)
        return Promise.all(approvals.map((approval, ix) => {
            if (Number(approval) <= Number(amounts[ix])) {
                if (contracts[ix].name !== 'Usdt' || (contracts[ix].name == 'Usdt' && amounts[ix] == 0)) {
                    return contracts[ix].methods.approve(loihiAddress, "-1").send({ from: walletAddress })
                } else return Promise.all([
                    contracts[ix].methods.approve(loihiAddress, 0).send({ from: walletAddress }),
                    contracts[ix].methods.approve(loihiAddress, "-1").send({ from: walletAddress })
                ])
            } else {
                return Promise.resolve()
            }
        }))
    }

    async function doDeposit () {
        console.log("do deposit")
        const tx = loihi.methods.selectiveDeposit(addresses, amounts, 1, Date.now() + 2000)
        const estimate = await tx.estimateGas({from: walletAddress})
        console.log("estimate", estimate)
        console.log("estimate * 1.5", estimate * 1.5)
        return tx.send({ from: walletAddress, gas: Math.floor(estimate * 1.5), gasPrice: gasPrice})
        
    }

    function complete () { console.log("complete")    }

    function triage (err) { console.log("err", err) }

}

export const proportionalWithdraw = async function () {
    const { store } = this.props

    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')
    const shellBalanceRaw = store.get('shellBalanceRaw')
    console.log("shell ballance", store.get("shellBalance"))
    const loihi = store.get('loihiObject')

    const tx = loihi.methods.proportionalWithdraw(shellBalanceRaw)

    return tx.estimateGas({from: walletAddress}).then(function () {
        console.log("GAS", arguments[0])
        return tx.send({from: walletAddress, gas: Math.floor(arguments[0] * 1.2) })
    }).then(function () {
        console.log("done withdraw", arguments)
    })

}

export const primeSwap = async function (value) {
    const { store } = this.props
    value = Number(value)

    const isOrigin = store.get('isOriginSwap')

    console.log("prime swap", typeof value, value)

    const walletAddress = store.get('walletAddress')
    const loihi = store.get('loihiObject')
    const originSlot = store.get('originSlot')
    const targetSlot = store.get('targetSlot')
    const contracts = store.get('contractObjects')
    const origin = contracts[originSlot]
    const target = contracts[targetSlot]
    if (!walletAddress || !loihi) return

    const rawValue = isOrigin
        ? origin.getRaw(value)
        : target.getRaw(value)

    const numberOfChickensOnOtherSideOfRoad = isOrigin
        ? await loihi.methods.viewOriginTrade(origin.options.address, target.options.address, rawValue).call()
        : await loihi.methods.viewTargetTrade(origin.options.address, target.options.address, rawValue).call()

    console.log("raw value", rawValue, typeof rawValue)

    if (isOrigin) {
        store.set("rawOriginAmount", rawValue) 
        store.set("rawTargetAmount", numberOfChickensOnOtherSideOfRoad)
    } else {
        store.set("rawTargetAmount", rawValue) 
        store.set("rawOriginAmount", numberOfChickensOnOtherSideOfRoad)
    }

    if (isOrigin) {
        store.set('originAmount', origin.getDecimal(value))
        store.set('targetAmount', target.getDisplay(numberOfChickensOnOtherSideOfRoad))
    } else {
        store.set('originAmount', origin.getDisplay(numberOfChickensOnOtherSideOfRoad))
        store.set('targetAmount', target.getDecimal(value))
    }

    console.log("number of chickens", numberOfChickensOnOtherSideOfRoad)

}

export const swap = async function () {

    const { store } = this.props

    const walletAddress = store.get('walletAddress')

    const loihi = store.get('loihiObject')
    const originSlot = store.get('originSlot')
    const targetSlot = store.get('targetSlot')
    const contracts = store.get('contractObjects')
    const origin = contracts[originSlot]
    const target = contracts[targetSlot]

    const isOrigin = store.get('isOriginSwap')

    const rawOrigin = store.get('rawOriginAmount')
    const rawTarget = store.get('rawTargetAmount')


    console.log("origin", origin)
    console.log("target", target)
    console.log("raw origin amount", rawOrigin)
    console.log("raw target amount", rawTarget)

    origin.methods.allowance(walletAddress, loihiAddress).call()
        .then(assureApproval)
        .then(doSwap)
        .then(complete)

    function assureApproval (approval) {
        if (Number(approval) < rawOrigin) {
            if (origin.name !== 'Usdt' || (origin.name == 'Usdt' && approval == 0)) {
                return origin.methods.approve(loihiAddress, rawOrigin).send({ from: walletAddress })
            } else {
                return Promise.all([
                    origin.methods.approve(loihiAddress, 0).send({ from: walletAddress }),
                    origin.methods.approve(loihiAddress, isOrigin ? rawOrigin : rawOrigin * 1.01).send({ from: walletAddress })
                ])
            }
        } else return Promise.resolve()
    }

    function doSwap () {
        return loihi.methods.swapByOrigin(
            origin.options.address, 
            target.options.address, 
            isOrigin ? rawOrigin : rawOrigin * 1.01, 
            isOrigin ? rawTarget * .99 : rawTarget, 
            Date.now() + 500 
        ).send({ from : walletAddress })
    }

    function complete () {

    }

}

export const setViewState = async function (index) {
    this.props.store.set('viewState', index)
}

export default { }
