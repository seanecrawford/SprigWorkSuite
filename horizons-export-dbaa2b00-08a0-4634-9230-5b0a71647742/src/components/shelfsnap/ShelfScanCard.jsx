
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Package, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const ShelfScanCard = ({ scan }) => {
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        onClick={() => setDetailViewOpen(true)}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{scan.store_name}</h3>
            <p className="text-slate-400 text-sm mt-1">Scan ID: {scan.id.substring(0, 8)}</p>
          </div>
          <span className={`px-3 py-1 text-xs rounded-full ${
            scan.status === 'analyzed' 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {scan.status}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-400">Compliance Score</span>
              <span className="text-white font-medium">{scan.compliance || 0}%</span>
            </div>
            <Progress value={scan.compliance || 0} className="h-2 [&>div]:bg-purple-600" />
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>{new Date(scan.scan_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Package className="w-4 h-4" />
              <span>{scan.products || 0} products</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertCircle className="w-4 h-4" />
              <span>{scan.issues || 0} issues</span>
            </div>
          </div>

          <Button onClick={(e) => { e.stopPropagation(); setDetailViewOpen(true); }} className="w-full bg-purple-600 hover:bg-purple-700">
            View Details
          </Button>
        </div>
      </motion.div>

      <Dialog open={isDetailViewOpen} onOpenChange={setDetailViewOpen}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Scan Details - {scan.store_name}</DialogTitle>
            <DialogDescription>
              Analysis of scan from {new Date(scan.scan_date).toLocaleString()}.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-center py-20 bg-slate-800/50 rounded-lg">
            <h3 className="text-lg text-white font-semibold">Detailed Scan View Coming Soon</h3>
            <p className="text-slate-400 mt-2">This view will show the shelf photo with color-coded bounding boxes for discrepancies.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShelfScanCard;
