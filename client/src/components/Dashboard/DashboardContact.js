import React, { useEffect, useState } from 'react';
import ContactMe from '../../pages/Contact/ContactMe';
import axios from '../../utils/axios'; // ✅ use global axios instance

const DashboardContact = () => {
  const [contactData, setContactData] = useState({
    title: '',
    paragraphs: [''],
  });

  const [messages, setMessages] = useState([]);
  const [isExistingData, setIsExistingData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const res = await axios.get('/api/contact');
      const data = res.data;

      if (data && data.title) {
        setContactData({
          title: data.title,
          paragraphs: data.paragraphs || [''],
        });
        setMessages(data.messages || []);
        setIsExistingData(true);
      }
    } catch (err) {
      console.error('Failed to fetch contact data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeTitle = (e) => {
    setContactData({ ...contactData, title: e.target.value });
  };

  const handleChangeParagraph = (index, value) => {
    const updated = [...contactData.paragraphs];
    updated[index] = value;
    setContactData({ ...contactData, paragraphs: updated });
  };

  const addParagraph = () => {
    setContactData({
      ...contactData,
      paragraphs: [...contactData.paragraphs, ''],
    });
  };

  const removeParagraph = (index) => {
    const updated = [...contactData.paragraphs];
    updated.splice(index, 1);
    setContactData({ ...contactData, paragraphs: updated });
  };

  const saveContact = async () => {
    try {
      const res = await axios.post('/api/contact/update', contactData);
      if (res.status === 200) {
        alert('Contact info saved!');
        setIsExistingData(true);
      } else {
        alert('Failed to save contact info');
      }
    } catch (err) {
      console.error('Error saving contact data', err);
      alert('Error saving contact info');
    }
  };

  const handleDeleteMessage = async (index) => {
    const target = messages[index];
    try {
      await axios.delete('/api/contact/delete-message', {
        data: {
          email: target.email,
          message: target.message,
        },
      });
    } catch (err) {
      console.error('Failed to delete message:', err);
    }

    const updated = [...messages];
    updated.splice(index, 1);
    setMessages(updated);
  };

  if (isLoading) return <p style={{ color: '#fff' }}>Loading...</p>;

  return (
    <div style={{ padding: '2rem', background: '#111', color: '#fff' }}>
      <h2>
        {isExistingData ? 'Edit Contact Section' : 'Create Contact Section'}
      </h2>

      <label>
        <strong>Title:</strong>
        <input
          type="text"
          value={contactData.title}
          onChange={handleChangeTitle}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />
      </label>

      {contactData.paragraphs.map((para, idx) => (
        <div key={idx} style={{ marginBottom: '1rem' }}>
          <label>
            <strong>Paragraph {idx + 1}:</strong>
            <textarea
              value={para}
              onChange={(e) => handleChangeParagraph(idx, e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '0.5rem',
              }}
              rows="2"
            />
          </label>
          {contactData.paragraphs.length > 1 && (
            <button
              onClick={() => removeParagraph(idx)}
              style={{
                background: '#b00',
                color: '#fff',
                border: 'none',
                padding: '0.4rem 0.8rem',
                cursor: 'pointer',
              }}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addParagraph}
        style={{
          background: '#0b0',
          color: '#fff',
          padding: '0.6rem 1.2rem',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '1.5rem',
        }}
      >
        + Add Paragraph
      </button>

      <br />
      <button
        onClick={saveContact}
        style={{
          background: '#007bff',
          color: '#fff',
          padding: '0.6rem 1.2rem',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '2rem',
        }}
      >
        {isExistingData ? 'Update' : 'Submit'}
      </button>

      {isExistingData && messages.length > 0 && (
        <>
          <hr style={{ margin: '2rem 0', borderColor: '#444' }} />
          <h3>Live Preview</h3>
          <ContactMe
            content={contactData}
            onMessageSubmit={(msg) => setMessages([...messages, msg])}
          />

          <hr style={{ margin: '2rem 0', borderColor: '#444' }} />
          <h3>Received Messages</h3>
          <ul
            style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}
          >
            {messages.map((msg, i) => (
              <li
                key={i}
                style={{
                  marginBottom: '1rem',
                  borderBottom: '1px solid #333',
                  paddingBottom: '0.5rem',
                }}
              >
                <strong>{msg.name}</strong> ({msg.email || 'no email'}):
                <br />
                {msg.message}
                <br />
                <button
                  onClick={() => handleDeleteMessage(i)}
                  style={{
                    background: '#b00',
                    color: '#fff',
                    padding: '0.4rem 0.8rem',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                  }}
                >
                  Delete This Message
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default DashboardContact;
