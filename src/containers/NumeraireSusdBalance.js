import React from 'react';

import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import asusdPng from '../assets/aSUSD.png'

import Grid from '@material-ui/core/Grid';

const styles = () => ({
    container: {
        alignItems: 'center',
        color: 'white',
        minHeight: 52,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    icon: { width: '50px', height: '50px' }
})

class NumeraireSUsdBalance extends React.Component {

    render() {
        const { classes, store } = this.props
        const susdReserve = store.get('susdReserve')
        return (
            <Grid container direction='row' className={classes.container} >
                <Grid item xs={3} sm={3}>
                    <img className={classes.icon} src={asusdPng} />
                </Grid>
                <Grid item xs={7} sm={7}>
                    <span> Aave Synthetix USD </span>
                </Grid>
                <Grid item xs={2} sm={2}>
                    <span> { susdReserve } </span>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(withStore(NumeraireSUsdBalance))
