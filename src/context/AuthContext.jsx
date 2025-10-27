import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { listFamilyMembers } from '../data/mockFamilyService.js';

const baseProfile = {
  id: 'jordan',
  name: 'Jordan Lee',
  email: 'jordan@saga.demo',
  location: 'Portland, Oregon',
  tagline: 'Curator of family stories and host of the winter cocoa chats.',
  memberSince: 2021
};

const seededConnections = [
  {
    id: 'conn-1',
    memberId: 'skylar',
    relation: 'Partner',
    connectionLevel: 'Inner circle',
    story: 'Married in 2018 and co-host of the winter cocoa chats.'
  },
  {
    id: 'conn-2',
    memberId: 'evelyn',
    relation: 'Parent',
    connectionLevel: 'Roots',
    story: 'Leads the Sunday soup call and shares recipe cards every season.'
  },
  {
    id: 'conn-3',
    memberId: 'amelia',
    relation: 'Sibling',
    connectionLevel: 'Branch crew',
    story: 'Coordinates the lantern walk tradition together each January.'
  }
];

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const familyMembers = useMemo(() => listFamilyMembers(), []);

  const login = useCallback(({ email, name }) => {
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim();

    const profileName = trimmedName?.length ? trimmedName : baseProfile.name;
    const profileEmail = trimmedEmail?.length ? trimmedEmail : baseProfile.email;

    setUser({
      ...baseProfile,
      name: profileName,
      email: profileEmail
    });
    setConnections(seededConnections);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setConnections([]);
  }, []);

  const addConnection = useCallback((payload) => {
    setConnections((previous) => {
      const nextId = `conn-${previous.length + 1}`;
      return [
        ...previous,
        {
          id: nextId,
          ...payload
        }
      ];
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      connections,
      familyMembers,
      login,
      logout,
      addConnection
    }),
    [user, connections, familyMembers, login, logout, addConnection]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
