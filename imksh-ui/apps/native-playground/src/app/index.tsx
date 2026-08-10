import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@imksh/ui-native';
import React from 'react';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center p-4">
      <Text className="text-2xl font-bold mb-8">@imksh/ui-native is working!</Text>
      
      <View className="w-full gap-4 items-center">
        <Button variant="default" size="md">
          Default Button
        </Button>
        <Button variant="destructive" size="md">
          Destructive Button
        </Button>
      </View>
    </SafeAreaView>
  );
}
