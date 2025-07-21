import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const handleStyle = {
  width: '8px',
  height: '8px',
  background: '#555',
};

const CustomNode = ({ data, type }: NodeProps) => {
  let nodeClass = '';
  switch (type) {
    case 'category':
      nodeClass = 'node-category';
      break;
    case 'tech':
      nodeClass = 'node-tech';
      break;
    case 'book':
      nodeClass = 'node-book';
      break;
  }

  return (
    <div className={nodeClass}>
      <Handle
        type="target"
        position={Position.Top}
        style={handleStyle}
      />
      <div>{data.label}</div>
      {data.author && <div style={{ fontSize: '10px', color: '#555' }}>- {data.author}</div>}
      <Handle
        type="source"
        position={Position.Bottom}
        style={handleStyle}
      />
      <Handle
        type="source"
        position={Position.Left}
        style={handleStyle}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle}
      />
    </div>
  );
};

export default memo(CustomNode); 