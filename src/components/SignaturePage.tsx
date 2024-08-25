import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from '../apiUrl';
import '../styles/SignaturePage.css';

const UserSignature: React.FC = () => {
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [privateKeyFile, setPrivateKeyFile] = useState<File | null>(null);

  const idNumber = localStorage.getItem('idNumber');
  const idType = localStorage.getItem('idType');

  const fetchPublicKey = async () => {
    try {
      if (!idNumber || !idType) {
        console.error('ID number or ID type is missing in localStorage.');
        return;
      }

      const response = await axios.get(`${apiUrl}/bank/download-key`, {
        params: {
          idNumber,
          idType,
          keyType: 'public',
        },
        responseType: 'blob',
      });

      // Create a URL for the public key file
      const url = window.URL.createObjectURL(response.data);
      console.log('Public key file URL:', url);

    } catch (error) {
      console.error('Error fetching public key:', error);
    }
  };

  const fetchPrivateKey = async () => {
    try {
      if (!idNumber || !idType) {
        console.error('ID number or ID type is missing in localStorage.');
        return;
      }

      const response = await axios.get(`${apiUrl}/bank/download-key`, {
        params: {
          idNumber,
          idType,
          keyType: 'private',
        },
        responseType: 'blob',
      });

      // Create a URL for the private key file
      const url = window.URL.createObjectURL(response.data);
      console.log('Private key file URL:', url);

    } catch (error) {
      console.error('Error fetching private key:', error);
    }
  };

  useEffect(() => {
    const fetchSignature = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${apiUrl}/bank/download-signature?idNumber=${idNumber}&idType=${idType}`
        );
        setSignature(response.data);
      } catch (err) {
        setError('No signature found. Would you like to create one?');
        console.error('Error fetching signature:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSignature();
  }, [idNumber, idType]);

  const renewSignature = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/bank/renew-signature`, {
        idNumber,
        idType,
      });
      setSignature(response.data.sign);
      alert('Signature renewed successfully');
    } catch (err) {
      setError('Error renewing signature');
      console.error('Error renewing signature:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadSignature = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/bank/download-signature?idNumber=${idNumber}&idType=${idType}`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `digital-signature-${idNumber}.pem`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setError('Error downloading signature');
      console.error('Error downloading signature:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSignature = async () => {
    try {
      setLoading(true);
      if (!privateKeyFile) {
        throw new Error('Private key file is missing.');
      }

      const formData = new FormData();
      formData.append('idNumber', idNumber ?? '');
      formData.append('idType', idType ?? '');
      formData.append('privateKeyFile', privateKeyFile);

      const response = await axios.post(`${apiUrl}/bank/generate-signature`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSignature(response.data.sign);
      alert('Signature created successfully');
    } catch (err) {
      setError('Error creating signature');
      console.error('Error creating signature:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPrivateKeyFile(file);
    }
  };

  return (
    <div className="signature-container">
      <h1>Firma Digital</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {signature ? (
            <>
              <p>Su firma actual: {signature}</p>
              <button onClick={renewSignature} disabled={loading}>
                Renovar Firma
              </button>
              <button onClick={downloadSignature} disabled={loading}>
                Descargar Firma
              </button>
            </>
          ) : (
            <>
              <p>{error}</p>
              <input type="file" onChange={handleFileChange} />
              <button onClick={createSignature} disabled={loading}>
                Crear Firma
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserSignature;
