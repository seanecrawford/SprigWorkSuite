
import React from 'react';
import { motion } from 'framer-motion';
import { Grid, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PlanogramEditor = () => {
  const { toast } = useToast();

  const handleCreate = () => {
    toast({
      title: "🚧 Feature coming soon!",
      description: "Drag-and-drop planogram editor will be available in the next update",
    });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-purple-500/20 rounded-2xl"
        >
          <Grid className="w-10 h-10 text-purple-400" />
        </motion.div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Planogram Editor</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Create and edit merchandising planograms with our intuitive drag-and-drop interface. AI will help optimize product placement based on sales data.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Planogram
          </Button>
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Load Template
          </Button>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-purple-400">Coming Soon:</span> Advanced planogram features including AI-powered product placement suggestions, compliance tracking, and real-time sync with shelf scans.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanogramEditor;
