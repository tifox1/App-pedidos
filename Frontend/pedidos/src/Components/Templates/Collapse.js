import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import NumForm from "../NumForm"

const CollapseLine = (props) => {
    return (<>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={props.open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                            Productos
                        </Typography>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Descripcion</TableCell>
                                    <TableCell>Cantidad</TableCell>
                                    <TableCell align="right">
                                        Precio Unitario
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.rows.map((Row) => (
                                    <TableRow key={Row.id}>
                                        <TableCell component="th" scope="row">
                                            {Row.product_id}
                                        </TableCell>
                                        <TableCell>
                                            <NumForm>{
                                                Row.product_uom_qty
                                            }</NumForm>
                                        </TableCell>
                                        <TableCell align="right">
                                            <NumForm>{Row.price_unit}</NumForm>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </>)
}
export default CollapseLine