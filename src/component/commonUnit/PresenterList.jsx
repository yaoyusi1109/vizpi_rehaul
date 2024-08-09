import React, { useState, useEffect, useContext } from 'react'
import '../../css/PresenterList.scss'
import { Typography } from '@mui/material'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { PresenterListContext } from '../../context/PresenterListContext'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import { Button } from '@mui/material'

const PresenterList = () => {
  const [presenterList, setPresenterList] = useState([])
  const { codeList, setCodeList } = useContext(PresenterListContext)
  const { setSelectedCode } = useContext(SelectedCodeContext)

  useEffect(() => {}, [presenterList])

  const handleClick = (code) => {
    setSelectedCode(code)
  }
  const handleDelete = (index) => {
    let newCodeList = [...codeList]
    newCodeList.splice(index, 1)
    //console.log(newCodeList)
    setCodeList(newCodeList)
  }
  return (
    <div classname="scafold">
      <Typography variant="h6" fontWeight={'light'} gutterBottom>
        Presenter List
      </Typography>
      <TableContainer>
        <Table className="testTable">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontSize={'+2'} fontWeight={'bold'}>
                  Name
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {codeList.map((row, index) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  <Button variant="text" onClick={() => handleClick(row.code)}>
                    {' '}
                    {row.name}
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton>
                    <DeleteIcon onClick={() => handleDelete(index)} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default PresenterList
