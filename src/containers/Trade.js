import React from 'react';
import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { swap, primeSwap } from '../actions/main'

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';


const styles = () => ({
   input: {
        width: '75%',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3)
    },
    control: {
        width: '100%'
    },
    select: {
        width: '25%'  
    },
    actionButton: {
        marginTop: theme.spacing(2),
        margin: '0px auto'
    },
    actionButtonContainer: {
        width: '100%',
        textAlign: 'center'
    },
    accountBalance: {
        float: 'right',
    },
    iconInBox: { 
        height: '35px',
        width: '35px', 
    },
})

class TradeContainer extends React.Component {

    constructor () {
        super()
        this.handleOriginInput = this.handleOriginInput.bind(this)
        this.handleTargetInput = this.handleTargetInput.bind(this)
        this.handleOriginSelect = this.handleOriginSelect.bind(this)
        this.handleTargetSelect = this.handleTargetSelect.bind(this)
    }

    swap() {
        swap.call(this)
    }

    handleOriginSelect (e) { 
        e.preventDefault()
        const { store } = this.props
        store.set('originSlot', e.target.value)
    }

    handleTargetSelect (e) { 
        e.preventDefault()
        const { store } = this.props
        store.set('targetSlot', e.target.value)
    }

    handleOriginInput(e) {
        e.preventDefault()
        const { store } = this.props
        store.set('isOriginSwap', true)
        primeSwap.call(this, e.target.value)
    }

    handleTargetInput (e) {
        e.preventDefault()
        const { store } = this.props
        store.set('isOriginSwap', false)
        primeSwap.call(this, e.target.value)
    }

    render() {
        const {classes, store} = this.props
        const walletAddress = store.get('walletAddress')
        const isSignedIn = walletAddress && walletAddress.length
        const coins = store.get('contractObjects')

        const originSlot = store.get('originSlot')
        const targetSlot = store.get('targetSlot')
        const originAmount = store.get('originAmount')
        const targetAmount = store.get('targetAmount')

        return (
            <Grid>
                <Grid container spacing={3}>
                    <Grid item xs={9} sm={9} md={9} lg={9}>
                        <TextField label={coins[originSlot].name}
                            placeholder='0'
                            className={classes.input}
                            margin="normal"
                            variant="outlined"
                            type="number"
                            onChange={ (e) => this.handleOriginInput(e) }
                            value={originAmount.toString() !== "0" ? originAmount : ''}
                            InputProps={{
                                inputProps: { min: 0 }, 
                                startAdornment: <InputAdornment position="start"> <img className={classes.iconInBox} src={coins[originSlot].icon}/> </InputAdornment> 
                            }}
                        >
                            <TextField 
                                select
                                onChange={ (e) => this.handleOriginSelect(e) }
                                value={originSlot}
                            >
                                { coins.map((coin, ix) => ( <MenuItem key={ix} value={ix}> { coin.symbol } </MenuItem>)) }
                            </TextField>
                        </TextField>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <TextField 
                            select
                            onChange={ (e) => this.handleOriginSelect(e) }
                            value={originSlot}
                        >
                            { coins.map((coin, ix) => ( <MenuItem key={ix} value={ix}> { coin.symbol } </MenuItem>)) }
                        </TextField>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={9} sm={9} md={9} lg={9}>
                        <TextField label={coins[targetSlot].name}
                            placeholder='0'
                            className={classes.input}
                            margin="normal"
                            variant="outlined"
                            type="number"
                            onChange={ (e) => this.handleTargetInput(e) }
                            value={targetAmount.toString() !== "0" ? targetAmount : ''}
                            InputProps={{
                                inputProps: { min: 0 }, 
                                startAdornment: <InputAdornment position="start"> <img className={classes.iconInBox} src={coins[targetSlot].icon}/> </InputAdornment> 
                            }}
                        />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} >
                        <TextField select
                            onChange={ (e) => this.handleTargetSelect(e) }
                            value={targetSlot}
                        >
                            { coins.map((coin, ix) => ( <MenuItem key={ix} value={ix}> { coin.symbol } </MenuItem>)) }
                        </TextField>
                    </Grid>
                </Grid>
                <Grid container>
                    <Box className={classes.actionButtonContainer}>
                        <Button color='primary'
                            size='large'
                            onClick={() => { this.swap() }} 
                            variant="contained" 
                            disabled={!isSignedIn} 
                            className={classes.actionButton}
                        >
                            Transfer
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(withStore(TradeContainer))
