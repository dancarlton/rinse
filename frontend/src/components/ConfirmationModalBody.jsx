import PropTypes from 'prop-types';

function ConfirmationModalBody({ extraObject, closeModal }) {
  const { message } = extraObject;

  const proceedWithYes = async () => {
    closeModal();
  };

  return (
    <>
      <p className=" text-xl mt-8 text-center">{message}</p>

      <div className="modal-action mt-12">
        <button className="btn btn-outline   " onClick={() => closeModal()}>
          Cancel
        </button>

        <button className="btn btn-primary w-36" onClick={() => proceedWithYes()}>
          Yes
        </button>
      </div>
    </>
  );
}

ConfirmationModalBody.propTypes = {
  extraObject: PropTypes.object,
  closeModal: PropTypes.func,
};

export default ConfirmationModalBody;
