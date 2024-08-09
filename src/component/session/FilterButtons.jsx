import React, { useState } from 'react';
import { Box, Button, ClickAwayListener, MenuItem, ButtonGroup, FormControl, IconButton, InputLabel } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';

const FilterButton = ({ filterValue, currentFilter, setFilter, label }) => {
    const isSelected = currentFilter === filterValue;

    return (
        <Button
            variant="outlined"
            sx={{
                backgroundColor: isSelected ? '#e3e6e7' : '',
                color: 'black',
                border: 'none',
                borderColor: '#e3e6e7',
                fontWeight: isSelected ? '800' : '400',
                pointerEvents: 'auto', // Ensure button remains interactive inside disabled MenuItem
                '&:hover': {
                    backgroundColor: isSelected ? '#e3e6e7' : '',
                    color: 'black',
                    border: 'none',
                    borderColor: '#e3e6e7',
                },
            }}
            onClick={() => setFilter(filterValue)}
        >
            {label}
        </Button>
    );
};

const FilterButtons = ({ filter, setFilter, sort, ascending, setAscending, handleSortChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleMoreClick = (event) => {
        setDropdownOpen((prev) => !prev);
    };

    const handleClose = () => {
        setDropdownOpen(false);
    };

    const handleFilterClick = (filterValue) => {
        setFilter(filterValue);
        handleClose();
    };

    const [sortMenuOpen, setSortMenuOpen] = useState(false);

    const handleSortClick = () => {
        setSortMenuOpen((prev) => !prev);
    };

    const handleSortMenuClose = () => {
        setSortMenuOpen(false);
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                    outline: '2px solid #e0dcdc',
                    padding: '5px',
                    borderRadius: '5px',
                    position: 'relative',
                    height: '40px',
                }}
            >
                <FilterButton filterValue="Any" currentFilter={filter} setFilter={setFilter} label="All" />
                <FilterButton filterValue="Python" currentFilter={filter} setFilter={setFilter} label="Python" />
                <FilterButton filterValue="Java" currentFilter={filter} setFilter={setFilter} label="Java" />
                <Button
                    aria-haspopup="true"
                    onClick={handleMoreClick}
                    sx={{
                        backgroundColor: filter !== 'Any' && filter !== 'Java' && filter !== 'Python' ? '#e3e6e7' : '',
                        '&:hover': {
                            backgroundColor: filter !== 'Any' && filter !== 'Java' && filter !== 'Python' ? '#e3e6e7' : '',
                        }
                    }}
                >
                    Filter <FilterListIcon />
                </Button>
                {dropdownOpen && (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '100%',
                                right: -50,
                                mt: 1,
                                mb: 2,
                                border: '2px solid #e0dcdc',
                                paddingTop: '5px',
                                paddingBottom: '5px',
                                borderRadius: '5px',
                                backgroundColor: 'white',
                                zIndex: 1,
                                color: 'black',
                            }}
                        >
                            <MenuItem disabled >
                                <Box sx={{ pointerEvents: 'auto' }}>
                                    <FilterButton filterValue="Auto Grouping" currentFilter={filter} setFilter={handleFilterClick} label="Auto Grouping" />
                                </Box>
                            </MenuItem>
                            <MenuItem disabled >
                                <Box sx={{ pointerEvents: 'auto' }}>
                                    <FilterButton filterValue="Helper/Helpee" currentFilter={filter} setFilter={handleFilterClick} label="Helper/Helpee" />
                                </Box>
                            </MenuItem>
                            <MenuItem disabled >
                                <Box sx={{ pointerEvents: 'auto' }}>
                                    <FilterButton filterValue="Blockly" currentFilter={filter} setFilter={handleFilterClick} label="Blockly" />
                                </Box>
                            </MenuItem>
                            <MenuItem disabled >
                                <Box sx={{ pointerEvents: 'auto' }}>
                                    <FilterButton filterValue="Blockly Shared" currentFilter={filter} setFilter={handleFilterClick} label="Blockly Shared" />
                                </Box>
                            </MenuItem>
                            <MenuItem disabled >
                                <Box sx={{ pointerEvents: 'auto' }}>
                                    <FilterButton filterValue="Audio" currentFilter={filter} setFilter={handleFilterClick} label="Audio" />
                                </Box>
                            </MenuItem>
                            <MenuItem disabled >
                                <Box sx={{ pointerEvents: 'auto' }}>
                                    <FilterButton filterValue="Vizmental" currentFilter={filter} setFilter={handleFilterClick} label="Vizmental" />
                                </Box>
                            </MenuItem>
                        </Box>
                    </ClickAwayListener>
                )}
            </Box>
            <Box
                sx={{
                    marginLeft: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                    outline: '2px solid #e0dcdc',
                    padding: '5px',
                    borderRadius: '5px',
                    height: '40px',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <ButtonGroup variant="text" aria-label="Basic button group">
                        
                        <IconButton
                        color={ascending ? '' : 'success'}
                            onClick={() => setAscending(false)}
                            sx={{ marginTop: '10px',
                              backgroundColor: ascending ?  '' : '#e3e6e7',
                            }}
                        >
                            <ArrowDownwardIcon />
                        </IconButton>
                        <IconButton
                            color={ascending ? 'success' : ''}
                            onClick={() => setAscending(true)}
                            sx={{ marginTop: '10px',
                              backgroundColor: ascending ? '#e3e6e7' : '',
                              marginRight: '10px'

                            }}
                            
                        >
                            <ArrowUpwardIcon />
                        </IconButton>
                    </ButtonGroup>
                    <FormControl margin="dense" size="small" sx={{ position: 'relative', alignItems:'center'}}>
                        <Button
                            onClick={handleSortClick}
                            sx={{
                                width: '120px',
                                border: '2px solid #e0dcdc',
                                borderRadius: '5px',
                                backgroundColor: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '5px 10px',
                                marginBottom: '6px',
                                marginTop: '3px',
                                alignContent:'center'
                                
                                // '&:hover': {
                                //     backgroundColor: '#e3e6e7',
                                // },
                            }}
                        >
                            {sort}<SortIcon sx={{marginLeft:'5px', marginRight:'5px', position:'absolute', right:'0'}} />
                        </Button>
                        {sortMenuOpen && (
                            <ClickAwayListener onClickAway={handleSortMenuClose}>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        mt: 1,
                                        mb: 2,
                                        border: '2px solid #e0dcdc',
                                        padding:'7px',
                                        paddingLeft: '10px',
                                        paddingRight: '10px',
                                        borderRadius: '5px',
                                        backgroundColor: 'white',
                                        zIndex: 1,
                                        color: 'black',
                                    }}
                                >
                                    <MenuItem key={0} value={'Time'} onClick={() => { handleSortChange({ target: { value: 'Time' } }); handleSortMenuClose(); }}>
                                        {'Time'}
                                    </MenuItem>
                                    <MenuItem key={1} value={'Students'} onClick={() => { handleSortChange({ target: { value: 'Students' } }); handleSortMenuClose(); }}>
                                        {'Students'}
                                    </MenuItem>
                                    <MenuItem key={2} value={'Passrate'} onClick={() => { handleSortChange({ target: { value: 'Passrate' } }); handleSortMenuClose(); }}>
                                        {'Passrate'}
                                    </MenuItem>
                                </Box>
                            </ClickAwayListener>
                        )}
                    </FormControl>
                </div>
                <Box />
            </Box>
        </>
    );
};

export { FilterButton, FilterButtons };
