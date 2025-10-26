
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Camera, Upload, Scan, AlertCircle, CheckCircle, Sparkles, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShelfScanCard from '@/components/shelfsnap/ShelfScanCard';
import PlanogramEditor from '@/components/shelfsnap/PlanogramEditor';
import { supabase } from '@/lib/customSupabaseClient';

const ShelfSnapPage = () => {
  const [scans, setScans] = useState([]);
  const [storesCount, setStoresCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);

    // Fetch scans
    const { data: scansData, error: scansError } = await supabase.from('shelf_scans').select('*').order('scan_date', { ascending: false });
    if (scansError) {
      toast({ title: "Error fetching scans", description: scansError.message, variant: "destructive" });
    } else {
      setScans(scansData || []);
    }
    
    // Fetch stores count
    const { count, error: storesError } = await supabase.from('stores').select('*', { count: 'exact', head: true });
    if (storesError) {
      toast({ title: "Error fetching stores", description: storesError.message, variant: "destructive" });
    } else {
      setStoresCount(count || 0);
    }
    
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCapture = async () => {
     try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        toast({
          title: "Camera activated!",
          description: "This is a placeholder. Full capture functionality is coming soon.",
        });
        // In a full implementation, you would use the stream with a video element
        stream.getTracks().forEach(track => track.stop());
    } catch (error) {
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please allow camera access in your browser settings to use this feature.",
        });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      toast({
        title: "File selected!",
        description: `${file.name} - AI analysis would start now.`,
      });
      // Here you would trigger the upload and AI processing pipeline
    }
  }

  const avgCompliance = scans.length > 0 ? Math.round(scans.reduce((acc, s) => acc + (s.compliance || 0), 0) / scans.length) : 0;
  const totalIssues = scans.reduce((acc, s) => acc + (s.issues || 0), 0);

  const stats = [
    { label: 'Total Scans', value: scans.length, icon: Scan, color: 'text-purple-400' },
    { label: 'Avg Compliance', value: `${avgCompliance}%`, icon: CheckCircle, color: 'text-green-400' },
    { label: 'Active Issues', value: totalIssues, icon: AlertCircle, color: 'text-yellow-400' },
    { label: 'Stores Monitored', value: storesCount, icon: Building, color: 'text-blue-400' },
  ];

  return (
    <>
      <Helmet>
        <title>ShelfSnap - Sprig Work Suite Pro</title>
        <meta name="description" content="AI-powered retail shelf management with automated product detection and planogram compliance" />
      </Helmet>

      <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">ShelfSnap</h1>
            <p className="text-slate-400 mt-1">AI-powered shelf management and compliance</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCapture} className="bg-purple-600 hover:bg-purple-700">
              <Camera className="w-4 h-4 mr-2" />
              Capture
            </Button>
            <Button onClick={handleUploadClick} variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-purple-400 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-2">AI Detection Engine Active</h3>
              <p className="text-slate-300 text-sm">
                Advanced AI automatically detects products, classifies items, compares against planograms, and highlights discrepancies in real-time.
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="scans" className="space-y-4">
          <TabsList className="bg-slate-800/50">
            <TabsTrigger value="scans">Recent Scans</TabsTrigger>
            <TabsTrigger value="planograms">Planograms</TabsTrigger>
          </TabsList>

          <TabsContent value="scans" className="space-y-4">
            {loading ? (
              <div className="text-center p-8 text-slate-400">Loading scans...</div>
            ) : scans.length === 0 ? (
              <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700/50">
                <p className="text-slate-400">No scans yet. Capture or upload your first shelf photo to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {scans.map((scan) => (
                  <ShelfScanCard key={scan.id} scan={scan} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="planograms">
            <PlanogramEditor />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ShelfSnapPage;
