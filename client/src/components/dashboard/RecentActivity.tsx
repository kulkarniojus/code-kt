import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  FileCode, 
  Search,
  GitBranch,
  Clock
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "chat" | "scan" | "search" | "view";
  title: string;
  description: string;
  timestamp: Date;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

const activityIcons = {
  chat: MessageSquare,
  scan: GitBranch,
  search: Search,
  view: FileCode,
};

export function RecentActivity({ activities = [] }: RecentActivityProps) {
  const defaultActivities: ActivityItem[] = [
    {
      id: "1",
      type: "scan",
      title: "Project Scanned",
      description: "Full codebase analysis completed",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "2",
      type: "chat",
      title: "Chat Session",
      description: "Asked about authentication flow",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: "3",
      type: "view",
      title: "File Viewed",
      description: "src/components/Header.tsx",
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
    },
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card data-testid="card-recent-activity">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <CardDescription>Your latest actions in the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          <div className="space-y-3">
            {displayActivities.map((activity) => {
              const Icon = activityIcons[activity.type];
              return (
                <div 
                  key={activity.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover-elevate"
                  data-testid={`activity-item-${activity.id}`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatTime(activity.timestamp)}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
