"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { ArrowRight, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function Hero() {
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [difyResult, setDifyResult] = useState("");
  const [url, setUrl] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  const handleSaveToNotion = async () => {
    try {
      // Get Notion OAuth URL from backend
      const response = await fetch('/api/notion/auth-url');
      const { authUrl } = await response.json();

      // Open Notion OAuth popup
      const authWindow = window.open(authUrl, '_blank', 'width=500,height=600');
      
      // Listen for OAuth callback message
      window.addEventListener('message', async (event) => {
        if (event.data.type === 'NOTION_AUTH_SUCCESS') {
          const { code } = event.data;
          
          // Exchange code for access token
          const tokenResponse = await fetch('/api/notion/exchange-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
          });
          
          if (tokenResponse.ok) {
            // Save content to Notion
            const saveResponse = await fetch('/api/notion/save', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                content: 'Content to save' // Replace with actual content
              })
            });

            if (saveResponse.ok) {
              toast({
                title: "Success",
                description: "Content saved to Notion successfully!"
              });
            } else {
              throw new Error('Failed to save to Notion');
            }
          } else {
            throw new Error('Failed to authenticate with Notion');
          }
          
          authWindow?.close();
          setShowSaveDialog(false);
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save to Notion: " + error,
        variant: "destructive"
      });
      setShowSaveDialog(false);
    }
  }

  const handleSaveToFeishu = () => {
    window.open('YOUR_FEISHU_SAVE_URL', '_blank')
    setShowSaveDialog(false)
  }
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "audio/*": [".mp3", ".wav"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
    },
    onDrop: (acceptedFiles) => {
      toast({
        title: "Files accepted",
        description: "Your files are being processed...",
      });
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setProgress(progress);
        if (progress === 100) {
          clearInterval(interval);
          toast({
            title: "Upload complete",
            description: "Your files have been processed successfully!",
          });
        }
      }, 500);
    },
    
  });

  const requestDify = async (text: string) => {
    // text = Text
    text = "欢迎收听十字路口。我们关注新一代 AI 技术浪潮带来的行业新变化和创业新机会。十字路口是乔布斯对苹果公司的一个比喻，形容它站在科技与人文的十字路口，伟大的产品往往诞生在这里，AI 正在给各行各业带来改变，我们寻找访谈和凝聚 AI 时代的积极行动者，和他们一起探索和拥抱新变化新的可能性。我是主播 Koji 杨远程。联合创办了街旁、新石像和唐岛。我相信科技，尤其是 AI，会在未来十年彻底改变社会，赋能人类。欢迎大家找我聊天，碰撞想法，链接下一个可能性。"
    console.log("requestDify");
    try {
      const response = await fetch('https://api.dify.ai/v1/workflows/run', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer app-JXpPTH7yrE4xMjXTulhYaQJg',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {
            long_text: text
          },
          response_mode: "streaming",
          user: "abc-123"
        })
      });

      if (!response.ok) {
        throw new Error('Failed to request Dify API');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      let result = '';
      
      if (reader) {
        while (true) {
          const {done, value} = await reader.read();
          if (done) break;
          
          // Convert the Uint8Array to text
          const text = new TextDecoder().decode(value);
          // Split by newlines to handle multiple SSE events
          const lines = text.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6); // Remove 'data: ' prefix
              try {
                const jsonData = JSON.parse(jsonStr);
                result = jsonData;
              } catch (e) {
                console.warn('Failed to parse JSON:', e);
              }
            }
          }
        }
      }
      
      return result;
      
    } catch (error) {
      console.error('Error requesting Dify:', error);
      throw error;
    }
  }

  const handleDifyRequest = async () => {
    try {
      const result = await requestDify("");
      const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;

      // Extract and format the result from data.outputs.result
      if (parsedResult?.data?.outputs?.result) {
        const formattedResult = parsedResult.data.outputs.result
          .replace(/\\n/g, '\n') // Replace escaped newlines with actual newlines
          .trim();
        setDifyResult(formattedResult);
      } else {
        setDifyResult('No result found in response');
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to get Dify result: " + error,
        variant: "destructive"
      });
    }
  };
  
  const handleConvert = async () => {
    // const audioUrl = "https://media.xyzcdn.net/ltRY-F3bzwTSZ_Pvd3CWyY0NHXYE.m4a";

    // setIsConverting(true);
    // setProgress(10);

    // try {
    //   // Fetch the audio file
    //   const audioResponse = await fetch(audioUrl);
    //   const audioBlob = await audioResponse.blob();
      
    //   // Create audio context
    //   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    //   const audioBuffer = await audioContext.decodeAudioData(await audioBlob.arrayBuffer());
      
    //   // Convert to mono channel if needed
    //   const audioData = audioBuffer.getChannelData(0);
      
    //   // Here you would typically send the audio data to a speech recognition service
    //   // For demo purposes, we'll just simulate progress
    //   setProgress(50);
      
    //   // Simulate processing time
    //   await new Promise(resolve => setTimeout(resolve, 2000));
      
    //   setProgress(100);
    //   toast({
    //     title: "Success",
    //     description: "Audio converted to text successfully!"
    //   });

    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to convert audio to text: " + error,
    //     variant: "destructive"
    //   });
    // } finally {
    //   setIsConverting(false);
    // }
  };

  return (
    <section className="container py-24 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Transform Your Audio Content into
          <span className="text-primary"> Professional Articles</span>
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Convert podcasts, videos, and audio into beautifully edited articles using advanced AI technology.
        </p>
      </div>

      <Card className="mx-auto max-w-3xl p-6 space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Drag & drop your files here</p>
          <p className="text-sm text-muted-foreground mt-1">
            Support for podcasts, videos, audio files, and documents
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">or paste a link</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter URL (YouTube, Spotify, etc.)"
              className="flex-1 px-4 py-2 rounded-md border bg-background"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button 
              // onClick={handleConvert}
              onClick={handleDifyRequest}
              disabled={isConverting}
            >
              {isConverting ? "Converting..." : "Start Converting"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setShowSaveDialog(true)}
            >
              Save Options
            </Button>
            {/* <Button
              onClick={handleDifyRequest}
            >
              Test Dify
            </Button> */}
          </div>
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save your content</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 mt-4">
                <Button onClick={handleSaveToNotion}>
                  Save to Notion(up coming)
                </Button>
                <Button onClick={handleSaveToFeishu}>
                  Save to Feishu(up coming)
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {progress > 0 && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">
              Processing... {progress}%
            </p>
          </div>
        )}

        {difyResult && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Dify API Response:</p>
            <pre className="whitespace-pre-wrap bg-secondary p-4 rounded-md overflow-auto h-[500px]">
              {difyResult}
            </pre>
          </div>
        )}
      </Card>
    </section>
  );
}


