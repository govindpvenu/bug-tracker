import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useBugs } from "@/hooks/use-bugs";
import {
  ArrowUpRight,
  Check,
  Circle,
  Bug,
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

type FilterKey = "all" | "active" | "completed";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Open" },
  { key: "completed", label: "Closed" },
];

function formatCreatedAt(value: string) {
  const createdAt = new Date(value);
  const now = new Date();
  const diffInHours = Math.max(
    0,
    Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60))
  );

  if (diffInHours < 1) {
    return "Created just now";
  }

  if (diffInHours < 24) {
    return `Created ${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `Created ${diffInDays}d ago`;
}

function EmptyState({ filter }: { filter: FilterKey }) {
  const title =
    filter === "completed"
      ? "No closed bugs"
      : filter === "active"
        ? "No open bugs"
        : "No bugs reported";

  const description =
    filter === "completed"
      ? "Resolve a few issues and they will land here."
      : filter === "active"
        ? "Your backlog is clear for now."
        : "Log the first bug to start tracking issues in this workspace.";

  return (
    <View className="overflow-hidden rounded-[18px] border border-border bg-card">
      <View className="border-b border-border px-5 py-4">
        <View className="w-28 rounded-md border border-border bg-background px-3 py-1">
          <Text className="text-[11px] font-medium uppercase tracking-[1.6px] text-muted-foreground">
            Empty state
          </Text>
        </View>
      </View>
      <View className="items-center px-6 py-12">
        <View className="mb-4 h-14 w-14 items-center justify-center rounded-lg border border-border bg-background">
          <Bug size={26} className="text-foreground" strokeWidth={1.75} />
        </View>
        <Text className="text-center text-xl font-semibold text-foreground">
          {title}
        </Text>
        <Text className="mt-2 max-w-xs text-center text-sm leading-6 text-muted-foreground">
          {description}
        </Text>
      </View>
    </View>
  );
}

function StatCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <View className="flex-1 rounded-[16px] border border-border bg-card px-4 py-4">
      <Text className="text-[11px] font-medium uppercase tracking-[1.6px] text-muted-foreground">
        {label}
      </Text>
      <Text className="mt-3 text-3xl font-semibold tracking-[-1px] text-foreground">
        {value}
      </Text>
      <Text className="mt-1 text-xs leading-5 text-muted-foreground">{caption}</Text>
    </View>
  );
}

export default function Index() {
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const { bugs, addBug, toggleBug, deleteBug } = useBugs();

  const closedCount = bugs.filter((bug) => bug.closed).length;
  const openCount = bugs.length - closedCount;
  const completionRatio = bugs.length === 0 ? 0 : closedCount / bugs.length;
  const completionWidth = `${Math.max(completionRatio * 100, bugs.length ? 8 : 0)}%`;
  const filteredBugs = bugs.filter((bug) => {
    if (filter === "active") {
      return !bug.closed;
    }

    if (filter === "completed") {
      return bug.closed;
    }

    return true;
  });
  const canAddBug = title.trim().length > 0;

  const handleAddBug = () => {
    if (!addBug(title)) {
      return;
    }

    setTitle("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="px-4 pb-10 pt-4"
        data={filteredBugs}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<EmptyState filter={filter} />}
        ListFooterComponent={<View className="h-6" />}
        ListHeaderComponent={
          <View className="mb-5 gap-4">
            <View className="overflow-hidden rounded-[20px] border border-border bg-card">
              <View className="border-b border-border px-5 py-4">
                <View className="flex-row items-center justify-between">
                  <View className="rounded-md border border-border bg-background px-3 py-1">
                    <Text className="text-[11px] font-medium uppercase tracking-[1.6px] text-muted-foreground">
                      Personal workspace
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2 rounded-md border border-border bg-background px-3 py-1">
                    <ArrowUpRight
                      size={14}
                      className="text-muted-foreground"
                      strokeWidth={2}
                    />
                    <Text className="text-xs text-muted-foreground">
                      Local sync
                    </Text>
                  </View>
                </View>
                <Text className="mt-5 max-w-xs text-[34px] font-semibold leading-[38px] tracking-[-1.6px] text-foreground">
                  Catch regressions before they pile up.
                </Text>
                <Text className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                  A focused bug board for quick capture, fast triage, and clean
                  visibility into what is still open.
                </Text>
              </View>

              <View className="gap-4 px-5 py-5">
                <View className="flex-row gap-3">
                  <StatCard
                    label="Total"
                    value={String(bugs.length)}
                    caption="Bugs currently tracked"
                  />
                  <StatCard
                    label="Open"
                    value={String(openCount)}
                    caption="Still waiting on a fix"
                  />
                </View>

                <View className="rounded-[16px] border border-border bg-background px-4 py-4">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-[11px] font-medium uppercase tracking-[1.6px] text-muted-foreground">
                        Resolution
                      </Text>
                      <Text className="mt-2 text-2xl font-semibold tracking-[-1px] text-foreground">
                        {Math.round(completionRatio * 100)}%
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-sm text-foreground">
                        {closedCount} closed
                      </Text>
                      <Text className="mt-1 text-xs text-muted-foreground">
                        {openCount} still open
                      </Text>
                    </View>
                  </View>
                  <View className="mt-4 h-2 overflow-hidden rounded-sm bg-muted">
                    <View
                      className="h-full rounded-sm bg-foreground"
                      style={{ width: completionWidth }}
                    />
                  </View>
                </View>

                <View className="rounded-[16px] border border-border bg-background px-4 py-4">
                  <Text className="text-[11px] font-medium uppercase tracking-[1.6px] text-muted-foreground">
                    Report bug
                  </Text>
                  <View className="mt-4 flex-row items-center gap-3">
                    <Input
                      className="flex-1"
                      onChangeText={setTitle}
                      onSubmitEditing={handleAddBug}
                      placeholder="Describe the bug or regression"
                      returnKeyType="done"
                      value={title}
                    />
                    <Button
                      className="rounded-lg"
                      disabled={!canAddBug}
                      onPress={handleAddBug}
                      size="icon"
                    >
                      <Plus
                        size={18}
                        className="text-primary-foreground"
                        strokeWidth={2.25}
                      />
                    </Button>
                  </View>
                </View>
              </View>
            </View>

            <View className="rounded-[18px] border border-border bg-card px-4 py-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-[11px] font-medium uppercase tracking-[1.6px] text-muted-foreground">
                    Bug queue
                  </Text>
                  <Text className="mt-2 text-xl font-semibold tracking-[-0.8px] text-foreground">
                    {filter === "all"
                      ? "All bugs"
                      : filter === "active"
                        ? "Open bugs"
                        : "Closed bugs"}
                  </Text>
                </View>
                <Text className="text-sm text-muted-foreground">
                  {filteredBugs.length} visible
                </Text>
              </View>

              <View className="mt-4 flex-row gap-2">
                {FILTERS.map((item) => {
                  const isActive = item.key === filter;

                  return (
                    <Pressable
                      className={
                        isActive
                          ? "rounded-md border border-foreground bg-foreground px-4 py-2"
                          : "rounded-md border border-border bg-background px-4 py-2"
                      }
                      key={item.key}
                      onPress={() => setFilter(item.key)}
                    >
                      <Text
                        className={
                          isActive
                            ? "text-sm font-medium text-background"
                            : "text-sm font-medium text-muted-foreground"
                        }
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="mb-3 overflow-hidden rounded-[18px] border border-border bg-card">
            <View className="flex-row items-start gap-3 px-4 py-4">
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.closed }}
                className={
                  item.closed
                    ? "mt-0.5 h-11 w-11 items-center justify-center rounded-lg border border-foreground bg-foreground"
                    : "mt-0.5 h-11 w-11 items-center justify-center rounded-lg border border-border bg-background"
                }
                onPress={() => toggleBug(item.id)}
              >
                {item.closed ? (
                  <Check
                    size={18}
                    className="text-background"
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

              <Pressable className="flex-1" onPress={() => toggleBug(item.id)}>
                <View className="flex-row items-center justify-between gap-3">
                  <Text
                    className={
                      item.closed
                        ? "flex-1 text-base font-medium leading-6 text-muted-foreground line-through"
                        : "flex-1 text-base font-medium leading-6 text-foreground"
                    }
                  >
                    {item.title}
                  </Text>
                  <View
                    className={
                      item.closed
                        ? "rounded-md border border-border bg-secondary px-2.5 py-1"
                        : "rounded-md border border-border bg-background px-2.5 py-1"
                    }
                  >
                    <Text
                      className={
                        item.closed
                          ? "text-[11px] font-medium uppercase tracking-[1.2px] text-foreground"
                          : "text-[11px] font-medium uppercase tracking-[1.2px] text-muted-foreground"
                      }
                    >
                      {item.closed ? "Closed" : "Open"}
                    </Text>
                  </View>
                </View>
                <Text className="mt-2 text-xs leading-5 text-muted-foreground">
                  {formatCreatedAt(item.createdAt)}
                </Text>
              </Pressable>

              <Button
                className="rounded-lg"
                onPress={() => deleteBug(item.id)}
                size="icon"
                variant="ghost"
              >
                <Trash2 size={18} className="text-muted-foreground" strokeWidth={2} />
              </Button>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
}
