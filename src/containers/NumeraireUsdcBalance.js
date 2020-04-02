import React from 'react';

import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import cusdcSvg from '../assets/cusdc.svg'

import Grid from '@material-ui/core/Grid';

const styles = () => ({
    container: {
        alignItems: 'center',
        color: 'white',
        minHeight: 52,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    icon: { 
        width: '50px', 
        height: '50px' 
    }
})

class NumeraireUsdcBalance extends React.Component {

    render() {
        const { classes, store } = this.props
        const usdcBalance = store.get('usdcReserve')
        return (
            <Grid container direction='row' className={classes.container}>
                <Grid item xs={3} sm={3}>
                    <img className={classes.icon} src={cusdcSvg} />
                </Grid>
                <Grid item xs={7} sm={7}>
                    <span> Compound USDC </span>
                </Grid>
                <Grid item xs={2} sm={2}>
                    <span> { usdcBalance } </span>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(withStore(NumeraireUsdcBalance))
