import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

export default createMuiTheme({
    palette: {
        primary: {
            light: '#fff',
            main: '#fff',
            dark: '#fff',
            contrastText: '#000',
        },
        secondary: grey,
    },
    overrides: {
        MuiInputAdornment: {
            root: { color: '#EBEBEB !important' },
            positionEnd: { color: '#EBEBEB !important' }
        },
        MuiFormHelperText: { root: { color: '#EBEBEB !important', } },
        MuiFormLabel: { root: { color: '#EBEBEB !important', } },
        MuiTypography: { body1: { color: '#EBEBEB !important' } },
        MuiTextField: { fontSize: 14 },
        MuiMenuItem: { root: { /* color: '#EBEBEB', fontSize: 14 */ } },
        MuiInput: { root: { fontSize: '20px' } },
        MuiDisabled: { display: 'none' }, 
        MuiOutlinedInput: {
            root:{
                color: 'lightblue !important',
                height: '70px',
                fontSize: '27.5px',
                fontWeight: 100,
                '& $notchedOutline': { borderWidth: '1.5px !important', borderColor: 'lightblue !important' },
                '&$disabled $notchedOutline': { borderWidth: '2px !important', borderColor: '#6d858c !important' },
            },
        },
        MuiToggleButtonGroup: {
          grouped: {
            '&:not(:first-child)': {
              borderLeft: '1px solid #EBEBEB'
            }
          }
        },
        MuiToggleButton: {
            root: {
                border: '1px solid #EBEBEB',
                backgroundColor: '#fff',
                '&.Mui-selected': {
                    // back
                    backgroundColor: '#fff !important',
                    color: '#000',
                    fontWeight: '500',
                    '&:hover': {
                        backgroundColor: '#fff !important',
                    }
                },
                '&:hover': {
                    backgroundColor: '#fff !important',
                }
            }
        }
    }
});
