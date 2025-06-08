import { createContext, useContext, useEffect, useState } from "react";

interface ConnectionDetails {
  id: string;
  name: string;
  uri: string;
}

interface ConnectionsContextValue {
  connection: ConnectionDetails | undefined;
  allConnections: ConnectionDetails[];
  isEncryptionAvailable: boolean;
  checkEncryptionAvailability: () => Promise<boolean>;
  addConnection: (details: Omit<ConnectionDetails, "id">) => Promise<void>;
  removeConnection: (id: string) => Promise<void>;
  updateConnection: (
    id: string,
    details: Partial<ConnectionDetails>,
  ) => Promise<void>;
  selectConnection: (id: string) => void;
}

const ConnectionsContext = createContext<ConnectionsContextValue | undefined>(
  undefined,
);

export function ConnectionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [connections, setConnections] = useState<ConnectionDetails[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string>();
  const [isEncryptionAvailable, setIsEncryptionAvailable] = useState<
    "loading" | boolean
  >(false);

  // useEffect(() => {
  //   // Load saved connections on mount
  //   window.App.safeStorage.getConnections().then((savedConnections) => {
  //     if (savedConnections) {
  //       setConnections(savedConnections);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    checkEncryptionAvailability().then((isAvailable) => {
      if (!isAvailable) {
        setIsEncryptionAvailable(false);
      }
    });
  }, []);

  const checkEncryptionAvailability = async () => {
    return await window.App.safeStorage.isEncryptionAvailable();
  };

  const addConnection = async (details: Omit<ConnectionDetails, "id">) => {
    const newConnection = {
      ...details,
      id: crypto.randomUUID(),
    };

    const updatedConnections = [...connections, newConnection];
    await window.App.safeStorage.saveConnections(updatedConnections);
    setConnections(updatedConnections);
  };

  const removeConnection = async (id: string) => {
    const updatedConnections = connections.filter((conn) => conn.id !== id);
    await window.App.safeStorage.saveConnections(updatedConnections);
    setConnections(updatedConnections);

    if (selectedConnectionId === id) {
      setSelectedConnectionId(undefined);
    }
  };

  const updateConnection = async (
    id: string,
    details: Partial<ConnectionDetails>,
  ) => {
    const updatedConnections = connections.map((conn) =>
      conn.id === id ? { ...conn, ...details } : conn,
    );
    await window.App.safeStorage.saveConnections(updatedConnections);
    setConnections(updatedConnections);
  };

  const selectConnection = (id: string) => {
    setSelectedConnectionId(id);
  };

  return (
    <ConnectionsContext.Provider
      value={{
        connection: connections.find(
          (conn) => conn.id === selectedConnectionId,
        ),
        allConnections: connections,
        isEncryptionAvailable: isEncryptionAvailable === true,
        checkEncryptionAvailability,
        addConnection,
        removeConnection,
        updateConnection,
        selectConnection,
      }}
    >
      {children}
    </ConnectionsContext.Provider>
  );
}

export function useConnections() {
  const context = useContext(ConnectionsContext);
  if (!context) {
    throw new Error("useConnections must be used within a ConnectionsProvider");
  }
  return context;
}
