import React, { Component, Fragment } from 'react'

import './App.css'
import './flexbox-helpers.css'
import Papa from 'papaparse'
import Dropzone from 'react-dropzone'
import { chain } from 'lodash'
import Declaracion from './Declaracion'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'

const initialState = {
  header: {
    nombre: '',
    acuse: '',
    fecha: '',
    dependencia: ''
  },
  file: null,
  results: '',
  fields: [],
  byTema: [],
  groupings: ['FECHA', 'DEPENDENCIA', 'TEMA']
}

class App extends Component {
  state = initialState

  onDrop = files => {
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        const fileAsBinaryString = reader.result

        this.processFile(fileAsBinaryString)
        this.setState({ file: file })
      }
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')

      reader.readAsText(file)
    })
  }

  processFile = file => {
    Papa.parse(file, {
      header: true,
      complete: results => {
        this.setState({
          results,
          header: {
            nombre: results.data[0]['NOMBRE'],
            acuse: results.data[0]['ACUSE'],
            fecha: results.data[0]['FECHA'],
            dependencia: results.data[0]['DEPENDENCIA']
          }
        })

        this.setState({
          byTema: this.groupResults(results.data),
          fields: results.meta.fields
        })
      }
    })
  }

  groupResults = results => {
    return chain(results)
      .groupBy('TEMA')
      .omit('undefined')
      .reduce(
        (acc, content, nombre) => [
          ...acc,
          {
            nombre,
            subtemas: chain(content)
              .groupBy('SUBTEMA')
              .reduce((acc, valores, subtema) => {
                console.log({ subtema, valores })
                return [...acc, { subtema, valores }]
              }, [])
              .value()
          }
        ],
        []
      )

      .value()
  }

  reset = () => {
    this.setState(initialState)
  }

  render() {
    return (
      <div className="App">
        <div className="layout vertical center">
          <div
            style={{ width: '100%', maxWidth: 1200 }}
            className="layout vertical flex">
            <div className="layout horizontal" style={{ width: '100%' }}>
              <Typography variant="title" color="primary">
                Visor NO OFICIAL de archivos para{' '}
                <a href="https://1560000.org">1560000.org</a>
              </Typography>
            </div>
            {!this.state.results ? (
              <Fragment>
                <Dropzone
                  className="flex layout vertical center-center dropzone"
                  multiple={false}
                  onDrop={this.onDrop}
                  accept={'.csv'}>
                  {this.state.results ? (
                    <div>Resultados</div>
                  ) : (
                    <div>
                      <Typography variant="display2">
                        Arrastra un archivo para ver la declaración
                      </Typography>
                    </div>
                  )}
                </Dropzone>
              </Fragment>
            ) : (
              <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <Declaracion
                  {...this.state.header}
                  reset={this.reset}
                  temas={this.state.byTema || { tema: '', subtemas: [] }}
                />
              </div>
            )}
            <Divider />
            <div className="layout horizontal justified">
              <Typography variant="caption">
                Visor NO OFICIAL de archivos csv
              </Typography>
              <a href="https://github.com/sinisterra">Desarrollador</a>
              <a href="http://github.com/sinisterra/visor1560e3">
                Código Fuente
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
