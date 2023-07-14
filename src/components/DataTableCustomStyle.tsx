export const customStyles = {
    rows: {
        style: {
            minHeight: '72px', // override the row height
        },
    },
    headCells: {
        style: {
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
            background: '#000000',
            fontWeight: 800,
            color: '#ffffff',
            fontSize: '16px'
        },
    },
    cells: {
        style: {
            paddingLeft: '8px', // override the cell padding for data cells
            paddingRight: '8px',
        },
    }
};

export const paginationComponentOptions = {
    rowsPerPageText: 'Zapisa po stranici',
    color: '#000000',
};
