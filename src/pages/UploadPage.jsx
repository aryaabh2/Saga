import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const MAX_FILES = 12;

export default function UploadPage({ onSubmit }) {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const combinedFiles = [...files, ...acceptedFiles];
    const newFiles = combinedFiles.slice(0, MAX_FILES);
    setFiles(newFiles);

    if (combinedFiles.length > MAX_FILES) {
      setError(`You can add up to ${MAX_FILES} files for a single saga.`);
    } else if (showValidation) {
      if (newFiles.length && title.trim() && summary.trim()) {
        setError('');
      } else {
        setError('Please add a title, description, and at least one image to continue.');
      }
    } else {
      setError('');
    }
  }, [files, showValidation, summary, title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  });

  const filePreviews = useMemo(
    () =>
      files.map((file) => ({
        name: file.name,
        size: file.size
      })),
    [files]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowValidation(true);

    const trimmedTitle = title.trim();
    const trimmedSummary = summary.trim();

    if (!files.length || !trimmedTitle || !trimmedSummary) {
      setError('Please add a title, description, and at least one image to continue.');
      return;
    }

    onSubmit({
      files,
      title: trimmedTitle,
      summary: trimmedSummary
    });
  };

  const handleClearFiles = () => {
    setFiles([]);
    setError(showValidation ? 'Please add a title, description, and at least one image to continue.' : '');
  };

  useEffect(() => {
    if (showValidation && files.length && title.trim() && summary.trim()) {
      setError('');
    }
  }, [files.length, showValidation, summary, title]);

  return (
    <Stack spacing={4} component="form" onSubmit={handleSubmit}>
      <Box>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome to Saga
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
          Gather photos and notes from loved ones and let Saga weave a memorable keepsake that is easy to share
          with family and friends.
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={3}>
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.400',
                borderRadius: 2,
                bgcolor: isDragActive ? 'primary.50' : 'grey.50',
                p: 5,
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {isDragActive ? 'Drop the files here' : 'Drag and drop images or click to choose'}
              </Typography>
              <Typography color="text.secondary">
                Accepted formats: JPG, PNG, GIF. Up to {MAX_FILES} images for your saga.
              </Typography>
              {showValidation && files.length === 0 && (
                <Typography color="error" sx={{ mt: 2 }}>
                  Please upload at least one image.
                </Typography>
              )}
            </Box>

            {filePreviews.length > 0 && (
              <Stack spacing={1}>
                <Typography variant="subtitle1">Selected images</Typography>
                <Stack spacing={1} sx={{ maxHeight: 200, overflow: 'auto', pr: 1 }}>
                  {filePreviews.map((file) => (
                    <Box
                      key={file.name}
                      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <Typography>{file.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(file.size / 1024).toFixed(1)} KB
                      </Typography>
                    </Box>
                  ))}
                </Stack>
                <Box>
                  <Button color="secondary" onClick={handleClearFiles}>
                    Clear images
                  </Button>
                </Box>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={3}>
            <TextField
              label="Saga title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
              placeholder="Grandma & Grandpa's Holiday Memories"
              required
              error={showValidation && !title.trim()}
              helperText={
                showValidation && !title.trim()
                  ? 'A title is required.'
                  : "Give your saga a memorable name."
              }
            />
            <TextField
              label="Short description"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              fullWidth
              multiline
              minRows={3}
              placeholder="A joyful afternoon decorating the tree together at the community home."
              required
              error={showValidation && !summary.trim()}
              helperText={
                showValidation && !summary.trim()
                  ? 'Please share a short description to continue.'
                  : 'Share the essence of this memory in a few sentences.'
              }
            />
          </Stack>
        </CardContent>
      </Card>

      {error && <Alert severity="warning">{error}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained" size="large" sx={{ px: 4, borderRadius: 999 }}>
          Create my saga
        </Button>
      </Box>
    </Stack>
  );
}
