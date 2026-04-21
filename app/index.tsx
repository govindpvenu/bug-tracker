import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useTodos } from "@/hooks/use-todos";
import { Stack } from "expo-router";
import {
  Check,
  Circle,
  ListTodo,
  Plus,
  Trash2,
} from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from "react-native";

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-12">
      <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-secondary">
        <ListTodo size={28} className="text-secondary-foreground" />
      </View>
      <Text className="text-center text-xl font-semibold text-foreground">
        No tasks yet
      </Text>
      <Text className="mt-2 max-w-xs text-center text-sm text-muted-foreground">
        Add your first task above. Your list is saved locally on this device.
      </Text>
    </View>
  );
}

export default function Index() {
  const [title, setTitle] = useState("");
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;
  const canAddTodo = title.trim().length > 0;

  const handleAddTodo = () => {
    if (!addTodo(title)) {
      return;
    }

    setTitle("");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "My Todos",
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 bg-background"
      >
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          contentContainerClassName="flex-grow px-4 pb-8 pt-4"
          data={todos}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={<EmptyState />}
          ListFooterComponent={
            <View className="mt-4 flex-row gap-3">
              <View className="flex-1 rounded-2xl border border-border bg-card px-4 py-3">
                <Text className="text-xs uppercase tracking-wide text-muted-foreground">
                  Total
                </Text>
                <Text className="mt-1 text-2xl font-semibold text-foreground">
                  {todos.length}
                </Text>
              </View>
              <View className="flex-1 rounded-2xl border border-border bg-card px-4 py-3">
                <Text className="text-xs uppercase tracking-wide text-muted-foreground">
                  Active
                </Text>
                <Text className="mt-1 text-2xl font-semibold text-foreground">
                  {activeCount}
                </Text>
              </View>
              <View className="flex-1 rounded-2xl border border-border bg-card px-4 py-3">
                <Text className="text-xs uppercase tracking-wide text-muted-foreground">
                  Done
                </Text>
                <Text className="mt-1 text-2xl font-semibold text-foreground">
                  {completedCount}
                </Text>
              </View>
            </View>
          }
          ListHeaderComponent={
            <View className="mb-6 gap-4">
              <View className="rounded-3xl border border-border bg-card px-5 py-5">
                <Text className="text-2xl font-semibold text-foreground">
                  Plan your day
                </Text>
                <Text className="mt-1 text-sm leading-6 text-muted-foreground">
                  Capture tasks, mark progress, and keep everything stored on
                  this device.
                </Text>
                <View className="mt-4 flex-row items-center gap-3">
                  <Input
                    className="h-12 flex-1 rounded-2xl bg-background px-4"
                    onChangeText={setTitle}
                    onSubmitEditing={handleAddTodo}
                    placeholder="Enter a task"
                    returnKeyType="done"
                    value={title}
                  />
                  <Button
                    className="h-12 w-12 rounded-2xl"
                    disabled={!canAddTodo}
                    onPress={handleAddTodo}
                    size="icon"
                  >
                    <Plus
                      size={20}
                      className="text-primary-foreground"
                      strokeWidth={2.25}
                    />
                  </Button>
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View className="mb-3 flex-row items-center gap-3 rounded-3xl border border-border bg-card px-4 py-4">
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.completed }}
                className="h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background"
                onPress={() => toggleTodo(item.id)}
              >
                {item.completed ? (
                  <Check
                    size={20}
                    className="text-foreground"
                    strokeWidth={2.5}
                  />
                ) : (
                  <Circle
                    size={18}
                    className="text-muted-foreground"
                    strokeWidth={2}
                  />
                )}
              </Pressable>

              <Pressable
                className="flex-1"
                onPress={() => toggleTodo(item.id)}
              >
                <Text
                  className={
                    item.completed
                      ? "text-base text-muted-foreground line-through"
                      : "text-base text-foreground"
                  }
                >
                  {item.title}
                </Text>
                <Text className="mt-1 text-xs text-muted-foreground">
                  {item.completed ? "Completed" : "Pending"}
                </Text>
              </Pressable>

              <Button
                className="h-10 w-10 rounded-2xl"
                onPress={() => deleteTodo(item.id)}
                size="icon"
                variant="ghost"
              >
                <Trash2 size={18} className="text-muted-foreground" />
              </Button>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </>
  );
}
