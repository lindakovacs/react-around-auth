import React from 'react';
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
    const avatarRef = React.useRef("");

    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateAvatar({
          avatar: avatarRef.current.value,
        });
    }

    return (
      <PopupWithForm
        name="change-image"
        title="Change profile picture"
        // isOpen={props.isEditAvatarPopupOpen}
        isOpen={props.isOpen}
        onClose={props.onClose}
        onSubmit={handleSubmit}
      >
        <fieldset className="form__fields">
          <input
            type="url"
            className="form__input form__image-link"
            id="linkImage-input"
            name="imageLink"
            placeholder="Image link"
            minLength="2"
            required
            ref={avatarRef}
          />
          <span className="form__input-error" id="linkImage-input-error"></span>
          <button
            className="form__submit-button"
            type="submit"
            value="Save"
            aria-label="Save button"
          >
            Save
          </button>
        </fieldset>
      </PopupWithForm>
    );
}
export default EditAvatarPopup;