import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TitleCard from '../../components/Cards/TitleCard';
import { setPageTitle, showNotification } from '../../slices/headerSlice';
import { useProfileMutation } from '../../slices/usersSlice';
import { setCredentials } from '../../slices/authSlice';
import InputText from '../../components/Input/InputText';
import TextAreaInput from '../../components/Input/TextAreaInput';
import ToggleInput from '../../components/Input/ToggleInput';
import { useEffect } from 'react';

function ProfileSettings() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [profileApi] = useProfileMutation();

  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    about: '',
    language: 'English',
    timezone: '',
    syncData: true,
  });

  // Call API to update profile settings changes
  const updateProfile = async () => {
    try {
      const res = await profileApi({ name: formData.name, email: formData.email }).unwrap();
      dispatch(setCredentials(res));
      dispatch(showNotification({ message: 'Profile Updated', status: 1 }));
    } catch (err) {
      dispatch(showNotification({ message: err?.data?.message || 'Update failed', status: 0 }));
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setFormData((prev) => ({ ...prev, [updateType]: value }));
  };

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Profile Settings' }));
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return (
    <>
      <TitleCard title='Profile Settings' topMargin='mt-2'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <InputText
            labelTitle='Name'
            updateType='name'
            defaultValue={userInfo?.name || ''}
            updateFormValue={updateFormValue}
          />
          <InputText
            labelTitle='Email'
            updateType='email'
            defaultValue={userInfo?.email || ''}
            updateFormValue={updateFormValue}
          />
          <InputText
            labelTitle='Language'
            updateType='language'
            defaultValue='English'
            updateFormValue={updateFormValue}
          />
          <InputText
            labelTitle='Timezone'
            updateType='timezone'
            defaultValue=''
            placeholder='e.g. EST, PST'
            updateFormValue={updateFormValue}
          />
          <TextAreaInput
            labelTitle='About'
            updateType='about'
            defaultValue=''
            updateFormValue={updateFormValue}
          />
          <ToggleInput
            updateType='syncData'
            labelTitle='Sync Data'
            defaultValue={true}
            updateFormValue={updateFormValue}
          />
        </div>

        <div className='mt-16'>
          <button className='btn btn-primary float-right' onClick={() => updateProfile()}>
            Update
          </button>
        </div>
      </TitleCard>
    </>
  );
}

export default ProfileSettings;
