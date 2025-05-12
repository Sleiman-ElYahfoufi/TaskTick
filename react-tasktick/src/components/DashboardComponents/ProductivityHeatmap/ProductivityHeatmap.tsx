import React from 'react';
import './ProductivityHeatmap.css';
import { ResponsiveHeatMap } from '@nivo/heatmap';

interface ProductivityHeatmapProps {
  data?: any[];
}

const ProductivityHeatmap: React.FC<ProductivityHeatmapProps> = ({ data }) => {
 

  return (
    <div className="productivity-trends">
      
    </div>
  );
};

export default ProductivityHeatmap;