import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../context/AuthContext.jsx';
import FamilyTreeCanvas from '../components/FamilyTreeCanvas.jsx';

const relationOptions = ['Parent', 'Child', 'Sibling', 'Partner', 'Relative', 'Friend'];
const closenessLevels = ['Roots', 'Inner circle', 'Branch crew', 'Extended family'];

export default function ConnectionsPage() {
  const { familyMembers, connections, addConnection } = useAuth();
  const [selectedMemberId, setSelectedMemberId] = useState(familyMembers[0]?.id ?? '');
  const [relation, setRelation] = useState('Parent');
  const [level, setLevel] = useState('Inner circle');
  const [story, setStory] = useState('');
  const [success, setSuccess] = useState('');

  const memberMap = useMemo(() => new Map(familyMembers.map((member) => [member.id, member])), [familyMembers]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedMemberId || !story.trim()) {
      return;
    }

    addConnection({
      memberId: selectedMemberId,
      relation,
      connectionLevel: level,
      story: story.trim()
    });
    setStory('');
    setSuccess('Connection saved. The tree now reflects your relationship.');
  };

  return (
    <Stack spacing={{ xs: 3, md: 4 }} sx={{ width: '100%', maxWidth: { xs: '100%', lg: 1120 }, mx: 'auto' }}>
      <Card
        sx={{
          borderRadius: 4,
          px: { xs: 3, md: 4 },
          py: { xs: 3, md: 3.5 },
          background: (theme) =>
            `linear-gradient(140deg, ${alpha(theme.palette.secondary.light, 0.18)}, ${alpha(
              theme.palette.background.paper,
              0.96
            )})`,
          boxShadow: '0 18px 32px rgba(35, 74, 65, 0.18)'
        }}
      >
        <Stack spacing={1.5} textAlign={{ xs: 'center', md: 'left' }} alignItems={{ xs: 'center', md: 'flex-start' }}>
          <Typography variant="overline" sx={{ letterSpacing: 1.6, color: 'secondary.dark' }}>
            Build your tree
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Capture how each person is connected
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
            Select a family member, describe your relationship, and Saga will reflect the connection on the visual tree. Feel free
            to invent details—this is a safe demo space.
          </Typography>
        </Stack>
      </Card>

      <Grid
        container
        spacing={{ xs: 3, md: 4 }}
        alignItems="stretch"
        justifyContent="center"
        sx={{ mx: 'auto', width: '100%' }}
      >
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%', borderRadius: 3, bgcolor: 'common.white', boxShadow: '0 16px 32px rgba(44, 95, 45, 0.12)' }}>
            <CardContent component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2.5, md: 3.25 } }}>
              <Stack spacing={2.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LinkIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Add a new connection
                  </Typography>
                </Stack>
                <TextField
                  select
                  label="Family member"
                  value={selectedMemberId}
                  onChange={(event) => setSelectedMemberId(event.target.value)}
                  fullWidth
                >
                  {familyMembers.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.name} · {member.relation}
                    </MenuItem>
                  ))}
                </TextField>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField
                    select
                    label="They're my"
                    value={relation}
                    onChange={(event) => setRelation(event.target.value)}
                    fullWidth
                  >
                    {relationOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Connection level"
                    value={level}
                    onChange={(event) => setLevel(event.target.value)}
                    fullWidth
                  >
                    {closenessLevels.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
                <TextField
                  label="Story or note"
                  value={story}
                  onChange={(event) => setStory(event.target.value)}
                  multiline
                  minRows={3}
                  placeholder="We trade recipes every month and host the lantern walk together."
                  helperText="A short detail helps explain how this connection shows up in your saga."
                  required
                />
                <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 3, py: 1.2 }}>
                  Save connection
                </Button>
                {success && (
                  <Alert
                    icon={<CheckCircleIcon fontSize="inherit" />}
                    severity="success"
                    onClose={() => setSuccess('')}
                  >
                    {success}
                  </Alert>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card
            sx={{ height: '100%', borderRadius: 3, display: 'flex', flexDirection: 'column', bgcolor: 'common.white', boxShadow: '0 16px 32px rgba(44, 95, 45, 0.12)' }}
          >
            <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
              <Stack spacing={1.5} sx={{ height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Live family map
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tap a card to highlight someone and see where they sit in your story.
                </Typography>
                <Box sx={{ flexGrow: 1, minHeight: { xs: 320, md: 420 }, position: 'relative' }}>
                  <FamilyTreeCanvas
                    members={familyMembers}
                    selectedMemberId={selectedMemberId}
                    onSelectMember={setSelectedMemberId}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3, bgcolor: 'common.white', boxShadow: '0 14px 30px rgba(44, 95, 45, 0.12)' }}>
        <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Your current connections
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {connections.map((connection) => {
                const member = memberMap.get(connection.memberId);
                return (
                  <Chip
                    key={connection.id}
                    label={`${member?.name ?? 'Unknown'} • ${connection.relation}`}
                    sx={{
                      borderRadius: 2,
                      bgcolor: (theme) => alpha(theme.palette.primary.light, 0.12)
                    }}
                  />
                );
              })}
              {!connections.length && (
                <Typography variant="body2" color="text.secondary">
                  Add a connection above to start filling in your tree.
                </Typography>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
