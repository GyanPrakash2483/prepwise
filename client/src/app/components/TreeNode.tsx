import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TreeNodeData = {
  title: string;
  children?: TreeNodeData[];
};

type TreeNodeProps = {
  node: TreeNodeData;
  depth?: number;
};

const depthColors = [
  "bg-blue-100 border-blue-400",
  "bg-green-100 border-green-400",
  "bg-yellow-100 border-yellow-400",
  "bg-red-100 border-red-400",
  "bg-purple-100 border-purple-400",
  "bg-pink-100 border-pink-400"
];

export const TreeNode: React.FC<TreeNodeProps> = ({ node, depth = 0 }) => {
  const [expanded, setExpanded] = useState(true);
  const colorClass = depthColors[depth % depthColors.length];
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-start relative">
      {/* Node box with toggle */}
      <div
        className={`rounded px-4 py-2 shadow-md border-2 ${colorClass} cursor-pointer flex items-center gap-2`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren && (
          <span className="text-gray-600 font-bold">
            {expanded ? "−" : "+"}
          </span>
        )}
        <span>{node.title}</span>
      </div>

      {/* Animated children section */}
      <AnimatePresence initial={false}>
        {hasChildren && expanded && (
          <motion.div
            key="children"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col items-start mt-2 relative">
              {/* Children stack with left vertical border only where needed */}
              <div className="flex flex-col gap-4 pl-6 ml-10 border-l-2 border-gray-300 relative">
                {node.children?.map((child, index) => (
                  <div key={index} className="relative">
                    {/* Horizontal connector */}
                    <div className="absolute -left-6 top-5 w-6 h-px bg-gray-400" />
                    <TreeNode node={child} depth={depth + 1} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
