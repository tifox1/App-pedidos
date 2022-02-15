import { Collapse, FormControl, FormHelperText, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

const Autocompletado = (props) => {
    return(<>
            <FormControl variant="outlined" fullWidth>
                <Autocomplete
                    {...props}
                    value={props.value}
                    getOptionLabel={(option => option.title)}
                    renderInput={(params) =>
                        <TextField {...params}
                            label={props.title}
                            variant="outlined"
                        />
                    }
                />
            </FormControl>
            <Collapse in={props.error}>
                <FormHelperText error>{props.error}</FormHelperText>
            </Collapse>
    </>)
}

export default Autocompletado