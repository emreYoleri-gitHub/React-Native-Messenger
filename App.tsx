import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "react-native";
import { StreamChat } from "stream-chat";
import {
  OverlayProvider,
  Chat,
  ChannelList,
  Channel,
  MessageList,
} from "stream-chat-expo";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

const API_KEY = "3ejn8e5j79n9";
const client = StreamChat.getInstance(API_KEY);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [isReady, setIsReady] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  useEffect(() => {
    const connectUser = async () => {
      await client.connectUser(
        {
          id: "vadim",
          name: "Cadim Savin",
          image: "https://i.imgur.com/fR9Jz14.png",
        },
        client.devToken("vadim")
      );
      console.log("User connected");

      // create a channel

      const channel = client.channel("messaging", "public", {
        name: "Public Chat Room",
      });

      await channel.watch();

      setIsReady(true);
    };

    connectUser();

    return () => client.disconnectUser();
  }, []);

  const onChannelPressed = (channel) => {
    // console.log("channel", channel);
    setSelectedChannel(channel);
  };

  if (!isLoadingComplete || !isReady) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <OverlayProvider>
          <Chat client={client}>
            {selectedChannel ? (
              <Channel channel={selectedChannel}>
                <MessageList />
                <Text
                  style={{ marginTop: 50 }}
                  onPress={() => setSelectedChannel(null)}
                >
                  Go Back
                </Text>
              </Channel>
            ) : (
              <ChannelList onSelect={onChannelPressed} />
            )}
          </Chat>
        </OverlayProvider>
      </SafeAreaProvider>
    );
  }
}
