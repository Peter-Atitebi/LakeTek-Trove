import {
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress
} from '@mui/material';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { SERVER_BASE_URL } from '../utils/api';
import useAuthentication from '../hooks/useAuthentication';

const EditAccountDialog = ({ open, onClose, onSave }) => {
 const [error, setError] = useState(null);
 const [processing, setProcessing] = useState(false);
 const { session } = useAuthentication();
 const [success, setSuccess] = useState(false);
 const [accountDetails, setAccountDetails] = useState(null);

 useEffect(() => {
if (session?.user) {
  setAccountDetails(session.user);
}}, [session]);

const updateAccount = async () => {
  setProcessing(true);
  setError(null);
  setSuccess(false);

  try {
    const response = await axios.patch(`${SERVER_BASE_URL}auth/update`, accountDetails);
    setSuccess(true);
    onSave(response.data);
  } catch (error) {
    setError(error.response?.data?.message || 'Failed to update account');
  } finally {
    setProcessing(false);
  }
};



}
export default EditAccountDialog