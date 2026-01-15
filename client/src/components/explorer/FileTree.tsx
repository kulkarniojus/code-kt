import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen,
  FileCode,
  FileJson,
  FileText,
  File as FileIcon,
  FileType
} from "lucide-react";
import type { FileTreeNode } from "@shared/schema";

interface FileTreeProps {
  nodes: FileTreeNode[];
  onSelect: (node: FileTreeNode) => void;
  selectedPath?: string;
}

const fileIcons: Record<string, typeof FileCode> = {
  ts: FileCode,
  tsx: FileCode,
  js: FileCode,
  jsx: FileCode,
  json: FileJson,
  md: FileText,
  css: FileType,
  scss: FileType,
  html: FileCode,
};

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return fileIcons[ext] || FileIcon;
}

interface FileTreeItemProps {
  node: FileTreeNode;
  depth: number;
  onSelect: (node: FileTreeNode) => void;
  selectedPath?: string;
}

function FileTreeItem({ node, depth, onSelect, selectedPath }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const isFolder = node.type === "folder";
  const isSelected = selectedPath === node.path;
  const Icon = isFolder 
    ? (isExpanded ? FolderOpen : Folder)
    : getFileIcon(node.name);

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded);
    } else {
      onSelect(node);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm rounded-md hover-elevate",
          isSelected && "bg-accent text-accent-foreground"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        data-testid={`file-tree-item-${node.path.replace(/\//g, "-")}`}
      >
        {isFolder ? (
          <span className="w-4 h-4 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </span>
        ) : (
          <span className="w-4" />
        )}
        <Icon className={cn(
          "w-4 h-4 flex-shrink-0",
          isFolder ? "text-chart-4" : "text-muted-foreground"
        )} />
        <span className="truncate">{node.name}</span>
      </button>
      
      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map((child, idx) => (
            <FileTreeItem
              key={`${child.path}-${idx}`}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ nodes, onSelect, selectedPath }: FileTreeProps) {
  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Folder className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm">No files found</p>
        <p className="text-xs">Scan a project to see files</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {nodes.map((node, idx) => (
          <FileTreeItem
            key={`${node.path}-${idx}`}
            node={node}
            depth={0}
            onSelect={onSelect}
            selectedPath={selectedPath}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
