import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileTree } from "@/components/explorer/FileTree";
import { CodeViewer } from "@/components/explorer/CodeViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  FolderTree, 
  FileCode, 
  RefreshCw,
  Filter
} from "lucide-react";
import type { FileTreeNode } from "@shared/schema";

export default function Explorer() {
  const [selectedFile, setSelectedFile] = useState<FileTreeNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: fileTree = [], isLoading: loadingTree, refetch } = useQuery<FileTreeNode[]>({
    queryKey: ["/api/projects/current/files"],
  });

  const { data: fileContent = "", isLoading: loadingContent } = useQuery<string>({
    queryKey: ["/api/files/content", selectedFile?.path],
    enabled: !!selectedFile && selectedFile.type === "file",
  });

  const filterTree = (nodes: FileTreeNode[], query: string): FileTreeNode[] => {
    if (!query) return nodes;
    return nodes.reduce((acc, node) => {
      if (node.name.toLowerCase().includes(query.toLowerCase())) {
        acc.push(node);
      } else if (node.children) {
        const filtered = filterTree(node.children, query);
        if (filtered.length > 0) {
          acc.push({ ...node, children: filtered });
        }
      }
      return acc;
    }, [] as FileTreeNode[]);
  };

  const filteredTree = filterTree(fileTree, searchQuery);

  const countFiles = (nodes: FileTreeNode[]): number => {
    return nodes.reduce((count, node) => {
      if (node.type === "file") return count + 1;
      if (node.children) return count + countFiles(node.children);
      return count;
    }, 0);
  };

  return (
    <div className="h-full flex flex-col" data-testid="page-explorer">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FolderTree className="w-6 h-6" />
              Code Explorer
            </h1>
            <p className="text-muted-foreground">
              Navigate and view source code files
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <FileCode className="w-3 h-3" />
              {countFiles(fileTree)} files
            </Badge>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => refetch()}
              data-testid="button-refresh-files"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 pt-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          <Card className="lg:col-span-1 flex flex-col h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">Files</CardTitle>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-files"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              {loadingTree ? (
                <div className="p-4 space-y-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-6" />
                  ))}
                </div>
              ) : (
                <FileTree
                  nodes={filteredTree}
                  onSelect={setSelectedFile}
                  selectedPath={selectedFile?.path}
                />
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-2 h-full min-h-96">
            <CodeViewer
              file={selectedFile}
              content={fileContent}
              isLoading={loadingContent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
