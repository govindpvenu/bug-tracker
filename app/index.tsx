import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stack } from "expo-router";
import { Plus } from "lucide-react-native";
import { View } from "react-native";

export default function Index() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "My Todo App",
        }}
      />
      <View className="flex-1 items-center justify-start bg-background p-4">
        <View className="flex-row items-between justify-between gap-4 mt-4 w-full  ">
          <Input className="flex-1 rounded-full" placeholder="Enter a task" />
          <Button className="rounded-full h-10 w-10" size="icon">
            <Plus />
          </Button>
        </View>
      </View>
    </>
  );
}
