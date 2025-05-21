// components/TreeNode.tsx
import { FC } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface TreeNodeData {
  title: string;
  children?: TreeNodeData[];
  uuid: string;
  isCompleted: boolean;
}

export interface TreeNodeProps {
  node: TreeNodeData;
  level?: number;
  isLast?: boolean;
  clickHandler: (title: string) => void
  rightClickHandler: (uuid: string) => void
}

export const TreeNode: FC<TreeNodeProps> = ({ node, level = 0, isLast = false, clickHandler, rightClickHandler }) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="relative pl-6" onClick={(e) => {
      e.stopPropagation()
      clickHandler(node.title)
    }} onContextMenu={(e) => {
      e.stopPropagation()
      e.preventDefault()
      rightClickHandler(node.uuid)
    }}>
      {level > 0 && (
        <>
          <div
            className={cn(
              "absolute left-0 w-px bg-gray-300",
              isLast ? "-top-1 h-4" : "-top-2 bottom-0"
            )}
          />
          <div className="absolute left-0 top-3 w-6 h-px bg-gray-300" />
        </>
      )}

      <div
        className={cn(
          "inline-block bg-muted text-sm text-muted-foreground",
          "px-4 py-2 mb-2 rounded-md border border-gray-300 shadow-sm",
          "hover:border-primary hover:bg-primary/10 transition-colors duration-150",
          "dark:text-white hover:cursor-pointer text-black"
        )}
      >
        <div className="flex items-center justify-center gap-6">
          {node.title}
          {node.isCompleted && <Check color='#2ea80f' />}
        </div>
      </div>

      {hasChildren && (
        <div className="pl-4 ml-2 relative">
          {node.children!.map((child, index) => (
            <TreeNode
              key={index}
              node={child}
              level={level + 1}
              isLast={index === node.children!.length - 1}
              clickHandler={clickHandler}
              rightClickHandler={rightClickHandler}
            />
          ))}
        </div>
      )}
    </div>
  );
};
