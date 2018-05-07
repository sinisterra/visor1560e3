import React, { Fragment } from 'react'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui/ExpansionPanel'
import Typography from 'material-ui/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'

class Declaracion extends React.Component {
  render() {
    const { temas, nombre, fecha, dependencia, reset } = this.props
    return (
      <div>
        <div className="layout horizontal end-justified">
          <Button variant="flat" color="primary" onClick={reset}>
            Seleccionar otro archivo
          </Button>
        </div>
        <Paper
          elevation={3}
          style={{
            backgroundColor: '#3F51B5',
            padding: '112px 24px 24px 24px',
            marginBottom: 24
          }}>
          <Typography variant="headline" style={{ color: 'white' }}>
            {fecha} - {dependencia}
          </Typography>
          <Typography variant="display2" style={{ color: 'white' }}>
            {nombre}
          </Typography>
        </Paper>
        {(temas || []).map((tema, i) => (
          <Fragment key={i}>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <div className="layout horizontal" style={{ width: '100%' }}>
                  <Typography variant="body2" className="flex-2">
                    {tema.nombre}
                  </Typography>
                  <Typography variant="subheading" className="flex-3" />
                </div>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div className="layout vertical" style={{ width: '100%' }}>
                  {tema.subtemas.map(({ subtema, valores }) => (
                    <Fragment key={`${i}-${subtema}`}>
                      <div className="layout horizontal">
                        <Typography variant="body2" className="flex-2">
                          {subtema}
                        </Typography>
                        <div className="flex-3">
                          {valores.map(({ VALOR }) => (
                            <Typography variant="body1">{VALOR}</Typography>
                          ))}
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Fragment>
        ))}
      </div>
    )
  }
}
export default Declaracion
