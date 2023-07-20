import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const BaseDetailsModal = ({show, onCloseButtonClick, title, modalData}: any) => {
    if (!show) {
        return null;
    }

    return (
        <Modal
            show={show}
            backdrop="static"
            onHide={onCloseButtonClick}
            keyboard={false}
            centered
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {Object.keys(modalData).map(function (keyObject, objectValue) {
                    return <p><span><b>{modalData[keyObject]['title']}</b></span>: {modalData[keyObject]['value']}</p>
                })}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCloseButtonClick}>
                    Zatvori
                </Button>
            </Modal.Footer>
        </Modal>

    );
};

export default BaseDetailsModal;