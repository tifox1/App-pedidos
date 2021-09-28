import NumberFormat from "react-number-format";
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const CollapseLine = (props) => {
    return (
        <>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={props.open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Historial
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Descripcion</TableCell>
                                        <TableCell>Cantidad</TableCell>
                                        <TableCell align="right">Precio Unitario</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.rows.map((Row) => (
                                        <TableRow key={Row.id}>
                                            <TableCell component="th" scope="row">
                                                {Row.product_id}
                                            </TableCell>
                                            <TableCell><NumberFormat value={Row.product_uom_qty} displayType="text" thousandSeparator="." decimalSeparator="," fixedDecimalScale={true} decimalScale={2}/></TableCell>
                                            <TableCell align="right"><NumberFormat value={Row.price_unit} displayType="text" thousandSeparator="." decimalSeparator="," fixedDecimalScale={true} decimalScale={2}/></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}
export default CollapseLine;