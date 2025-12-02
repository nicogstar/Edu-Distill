import React, { useState, useRef, useEffect } from 'react';
import ConversationalDashboard from './components/ConversationalDashboard';
import DistillationGraphic from './components/DistillationGraphic';

const App: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollTop / window.innerHeight);
      setActiveSlide(index);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 text-white font-sans selection:bg-cyan-500/30">

      {/* Global Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black z-0" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] z-0 pointer-events-none"></div>

      {/* Main Scroll Container */}
      <div
        ref={scrollRef}
        className="relative z-10 w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth transition-all duration-700"
      >

        {/* Slide 1: Title */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start overflow-hidden">
          <DistillationGraphic />
          <div className="relative z-10 text-center pointer-events-none mt-[-10vh] max-w-4xl px-6">
            <div className="inline-block border border-cyan-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <h2 className="text-xs md:text-sm font-bold text-cyan-400 uppercase tracking-[0.3em]">
                The Vision
              </h2>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 header-font tracking-tighter drop-shadow-2xl">
              Edu-Distill
            </h1>
            <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed mb-8">
              Hello everyone. We are <span className="text-cyan-400 font-semibold">Simone, Nicola and Daniele</span> and today we present Edu-Distill.
              Our goal is simple: we want to <span className="text-cyan-400 font-semibold">democratize AI evaluation</span>.
            </p>
            <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed">
              We have built a system that provides high-quality grading on standard consumer laptops using a technique called <span className="text-cyan-400 font-semibold">Knowledge Distillation</span>.
            </p>
            <div className="mt-12 pointer-events-auto">
              <button
                onClick={() => scrollRef.current?.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="animate-bounce"
              >
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Slide 2: The Motivation */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-5xl px-6 text-center">
            <div className="inline-block border border-purple-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <h2 className="text-sm font-bold text-purple-400 uppercase tracking-[0.3em]">The Motivation</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 header-font drop-shadow-lg">
              The AI Education Trilemma
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Why did we build this? Currently, using AI for education faces three big problems.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="glass-panel p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-lg font-bold text-white mb-3">Cost</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Running massive models for every student answer is too expensive.
                </p>
              </div>
              <div className="glass-panel p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-lg font-bold text-white mb-3">Privacy</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Schools cannot send private student data to cloud servers like OpenAI due to GDPR laws.
                </p>
              </div>
              <div className="glass-panel p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">⏱️</div>
                <h3 className="text-lg font-bold text-white mb-3">Latency</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Cloud services are too slow for real-time oral exams. We need a solution that is cheap, private, and fast.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 3: System Overview */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-5xl px-6 text-center">
            <div className="inline-block border border-blue-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <h2 className="text-sm font-bold text-blue-400 uppercase tracking-[0.3em]">System Overview</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 header-font drop-shadow-lg">
              The User Journey
            </h1>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
              <div className="glass-panel p-6 rounded-2xl w-64">
                <div className="text-4xl mb-2">👩‍🏫</div>
                <h3 className="font-bold text-white">Teacher</h3>
                <p className="text-xs text-slate-400">Uploads Materials</p>
              </div>
              <div className="text-2xl text-slate-600">→</div>
              <div className="glass-panel p-6 rounded-2xl w-64">
                <div className="text-4xl mb-2">🎓</div>
                <h3 className="font-bold text-white">Student</h3>
                <p className="text-xs text-slate-400">Answers via Text/Voice</p>
              </div>
              <div className="text-2xl text-slate-600">→</div>
              <div className="glass-panel p-6 rounded-2xl w-64 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <div className="text-4xl mb-2">🤖</div>
                <h3 className="font-bold text-cyan-400">Local Agent</h3>
                <p className="text-xs text-slate-400">Offline Grading on Device</p>
              </div>
            </div>
            <p className="text-lg text-slate-300 mt-12 max-w-3xl mx-auto leading-relaxed">
              The magic happens in the middle: the <span className="text-cyan-400 font-bold">Local Evaluator Agent</span>. Instead of sending data to the cloud, the grading happens right there on the device, offline, producing structured feedback instantly.
            </p>
          </div>
        </div>

        {/* Slide 4: Related Works & Competitors */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-5xl px-6 text-center">
            <div className="inline-block border border-cyan-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-[0.3em]">Related Works</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 header-font drop-shadow-lg">
              Related Works & Competitors
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              How does Edu-Distill compare to existing solutions?
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="glass-panel p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">☁️</div>
                <h3 className="text-lg font-bold text-white mb-3">Cloud APIs (GPT-4)</h3>
                <div className="text-left space-y-2">
                  <p className="text-sm text-emerald-400">✓ Good Performance</p>
                  <p className="text-sm text-rose-400">✗ High Cost</p>
                  <p className="text-sm text-rose-400">✗ Privacy Risks</p>
                </div>
              </div>
              <div className="glass-panel p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">🖥️</div>
                <h3 className="text-lg font-bold text-white mb-3">Standard Local LLMs (Llama-3 8B)</h3>
                <div className="text-left space-y-2">
                  <p className="text-sm text-emerald-400">✓ Private</p>
                  <p className="text-sm text-rose-400">✗ Heavy Hardware</p>
                  <p className="text-sm text-slate-400 text-xs">(8GB+ VRAM)</p>
                </div>
              </div>
              <div className="glass-panel p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">🔤</div>
                <h3 className="text-lg font-bold text-white mb-3">Keyword Matchers (Regex)</h3>
                <div className="text-left space-y-2">
                  <p className="text-sm text-emerald-400">✓ Fast & Cheap</p>
                  <p className="text-sm text-rose-400">✗ "Dumb"</p>
                  <p className="text-sm text-slate-400 text-xs">(No reasoning)</p>
                </div>
              </div>
            </div>

            <div className="mt-10 glass-panel p-6 rounded-2xl border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <p className="text-lg text-white font-semibold">
                <span className="text-cyan-400">Edu-Distill</span> fills the gap: <span className="text-emerald-400">Private</span>, <span className="text-purple-400">Lightweight</span>, and <span className="text-orange-400">Intelligent</span>.
              </p>
            </div>
          </div>
        </div>


        {/* Slide 5: Theoretical Background */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-4xl px-6 text-center">
            <div className="inline-block border border-emerald-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-[0.3em]">Theoretical Background</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 header-font drop-shadow-lg">
              Small Language Models
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              To achieve this, we moved away from the idea that 'bigger is better.' We are using <span className="text-emerald-400 font-bold">Small Language Models (SLMs)</span>.
            </p>
            <div className="glass-panel p-8 rounded-3xl text-left">
              <p className="text-lg text-slate-300 leading-relaxed mb-4">
                We based our work on <span className="text-white font-bold">Hinton’s theory of Knowledge Distillation</span>.
              </p>
              <p className="text-slate-400">
                The idea is that a small, specialized model can outperform a giant generalist model if it is trained specifically for one task—in our case, <span className="text-emerald-400">academic grading</span>.
              </p>
              <p className="text-slate-400 mt-4 border-t border-white/10 pt-4">
                <span className="text-emerald-400 font-bold">Concept:</span> Transferring "Dark Knowledge" (reasoning patterns) via soft targets.
              </p>
            </div>
          </div>
        </div>

        {/* Slide 6: Training Process Timeline */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-6xl px-6 text-center">
            <div className="inline-block border border-amber-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <h2 className="text-sm font-bold text-amber-400 uppercase tracking-[0.3em]">The Pipeline</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 header-font drop-shadow-lg">
              Training Process Timeline
            </h1>
            <p className="text-xl text-slate-300 mb-10">
              From raw data to deployment-ready model in 5 stages.
            </p>

            {/* Timeline */}
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/20 via-amber-500/50 to-amber-500/20 hidden md:block"></div>

              <div className="grid md:grid-cols-5 gap-4 relative">
                {/* Stage 1 */}
                <div className="glass-panel p-4 rounded-2xl border-amber-500/30 hover:border-amber-500/60 transition-all">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 font-bold">1</div>
                  <h3 className="text-sm font-bold text-white mb-2">Data Generation</h3>
                  <p className="text-xs text-slate-400 mb-2">GPT-4o creates 500+ examples</p>
                </div>

                {/* Stage 2 */}
                <div className="glass-panel p-4 rounded-2xl border-orange-500/30 hover:border-orange-500/60 transition-all">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center text-orange-400 font-bold">2</div>
                  <h3 className="text-sm font-bold text-white mb-2">Teacher Training</h3>
                  <p className="text-xs text-slate-400 mb-2">Qwen2.5 7B fine-tuning</p>
                </div>

                {/* Stage 3 */}
                <div className="glass-panel p-4 rounded-2xl border-red-500/30 hover:border-red-500/60 transition-all">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-400 font-bold">3</div>
                  <h3 className="text-sm font-bold text-white mb-2">Distillation</h3>
                  <p className="text-xs text-slate-400 mb-2">Transfer to 1.5B Student</p>
                </div>

                {/* Stage 4 */}
                <div className="glass-panel p-4 rounded-2xl border-purple-500/30 hover:border-purple-500/60 transition-all">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center text-purple-400 font-bold">4</div>
                  <h3 className="text-sm font-bold text-white mb-2">Quantization</h3>
                  <p className="text-xs text-slate-400 mb-2">16-bit → 4-bit GGUF</p>
                </div>

                {/* Stage 5 */}
                <div className="glass-panel p-4 rounded-2xl border-cyan-500/30 hover:border-cyan-500/60 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-cyan-500/20 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 font-bold">5</div>
                  <h3 className="text-sm font-bold text-white mb-2">Deployment</h3>
                  <p className="text-xs text-slate-400 mb-2">Ready for laptops!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 7: Data Engineering */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-4xl px-6 text-center">
            <div className="inline-block border border-indigo-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-[0.3em]">The Engineering Engine</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500 header-font drop-shadow-lg">
              Data Engineering
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Let's look under the hood. To make a good grader, you need a strict dataset.
            </p>
            <div className="glass-panel p-8 rounded-3xl text-left">
              <div className="mb-6 pb-6 border-b border-white/10">
                <h3 className="text-lg font-bold text-indigo-400 mb-3">Synthetic Data Generation via GPT-4o</h3>
                <p className="text-slate-300">We leveraged GPT-4o to create a high-quality training dataset with over 500 carefully crafted examples.</p>
              </div>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-400 mt-1">1.</span>
                  <span>We generated <strong>'Tricky' examples</strong> containing deliberate hallucinations and logic traps to train the student to be a strict, zero-tolerance grader.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-400 mt-1">2.</span>
                  <span>We intentionally included <strong>fake scientific terms and misleading statements</strong> to test the model's ability to detect subtle errors.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-400 mt-1">3.</span>
                  <span>This ensures our student model doesn't just guess, but actually <strong>detects errors with precision</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-400 mt-1">4.</span>
                  <span>We forced the model to output a strict <strong>JSON format</strong> for structured, parseable feedback.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Slide 8: Model Architecture */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-6xl px-6">
            <div className="text-center mb-12">
              <div className="inline-block border border-orange-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                <h2 className="text-sm font-bold text-orange-400 uppercase tracking-[0.3em]">Model Architecture</h2>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 header-font mb-4 drop-shadow-lg">
                Teacher-Student Relationship
              </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center relative">
              {/* Arrow */}
              <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-slate-900 p-2 rounded-full border border-slate-700 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                  <svg className="w-8 h-8 text-orange-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-3xl border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
                <h3 className="text-2xl font-bold text-orange-400 mb-2">Teacher Model</h3>
                <p className="text-xl text-white font-mono mb-6">Qwen2.5 7B parameters</p>
                <p className="text-slate-400 text-sm mb-4">
                  It is smart but requires expensive hardware (A100 GPUs).
                </p>
              </div>

              <div className="glass-panel p-8 rounded-3xl border-red-500/20 hover:border-red-500/40 transition-all duration-300">
                <h3 className="text-2xl font-bold text-red-400 mb-2">Student Model</h3>
                <p className="text-xl text-white font-mono mb-6">Qwen2.5 1.5B parameters</p>
                <p className="text-slate-400 text-sm mb-4">
                  It is lightweight and runs on a normal CPU. Our goal was to compress the Teacher's intelligence into the Student's efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 9: Distillation Strategy */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-4xl px-6 text-center">
            <div className="inline-block border border-pink-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
              <h2 className="text-sm font-bold text-pink-400 uppercase tracking-[0.3em]">Distillation Strategy</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500 header-font drop-shadow-lg">
              Logits-Based Distillation
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              How did we teach the student? We didn't just use standard fine-tuning. Standard training only teaches the answer 'Right' or 'Wrong.'
            </p>
            <div className="glass-panel p-8 rounded-3xl">
              <p className="text-lg text-white leading-relaxed">
                We used <span className="text-pink-400 font-bold">Logits-Based Distillation</span>.
              </p>
              <p className="text-slate-400 mt-4">
                We taught the student to understand probability and uncertainty. This allows the small model to learn the <span className="text-white font-semibold">nuance of grading</span>, not just the final score.
              </p>
            </div>
          </div>
        </div>

        {/* Slide 10: Infrastructure */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-4xl px-6 text-center">
            <div className="inline-block border border-blue-600/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em]">Infrastructure</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-500 header-font drop-shadow-lg">
              Training Hardware
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Training required precision. We couldn't do this on a laptop.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">Google Colab Pro</h3>
                <p className="text-slate-400 text-sm">NVIDIA A100 GPUs</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">High Memory</h3>
                <p className="text-slate-400 text-sm">40GB VRAM</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl col-span-2">
                <h3 className="text-lg font-bold text-white mb-2">Bfloat16 Precision</h3>
                <p className="text-slate-400 text-sm">We loaded the Teacher model in its native High Definition format (uncompressed). This ensures the Student learns from pure, high-fidelity logits, avoiding the 'noise' caused by 4-bit quantization.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 9: The Mathematics */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-6xl px-6 text-center">
            <div className="inline-block border border-violet-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-4 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <h2 className="text-sm font-bold text-violet-400 uppercase tracking-[0.3em]">Mathematics</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500 header-font drop-shadow-lg">
              The Distillation Formula
            </h1>
            <p className="text-lg text-slate-300 mb-4">
              This is the mathematical heart of our project: the Hybrid Loss Function.
            </p>

            {/* Formula Display */}
            <div className="glass-panel p-4 rounded-2xl mb-4 border-violet-500/30">
              <p className="text-xl md:text-2xl font-mono text-white">
                Total Loss = (α × KL<sub className="text-sm">Divergence</sub>) + ((1 - α) × Cross<sub className="text-sm">Entropy</sub>)
              </p>
            </div>

            {/* Two Column Explanation */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="glass-panel p-4 rounded-2xl text-left border-purple-500/30">
                <h3 className="text-lg font-bold text-purple-400 mb-2">KL Divergence - The "Magic"</h3>
                <ul className="space-y-1 text-slate-300 text-xs">
                  <li>• Measures how the <span className="text-white font-semibold">Student (1.5B)</span> mimics the <span className="text-white font-semibold">Teacher's (7B)</span> probability distribution</li>
                  <li>• Uses <span className="text-purple-400 font-mono">Temperature (T=2.0)</span> to soften targets</li>
                  <li>• Teaches <span className="text-purple-400 font-semibold">nuance</span>: e.g., 'Feline' is close to 'Cat', 'Table' is wrong</li>
                </ul>
              </div>

              <div className="glass-panel p-4 rounded-2xl text-left border-cyan-500/30">
                <h3 className="text-lg font-bold text-cyan-400 mb-2">Cross-Entropy - The "Truth"</h3>
                <ul className="space-y-1 text-slate-300 text-xs">
                  <li>• Compares the student's answer to the <span className="text-white font-semibold">hard ground truth</span> in the dataset</li>
                  <li>• Ensures the model stays <span className="text-cyan-400 font-semibold">grounded and accurate</span> to the reference material</li>
                  <li>• Prevents the model from drifting away from correct answers</li>
                </ul>
              </div>
            </div>

            {/* Summary */}
            <div className="glass-panel p-4 rounded-2xl border-fuchsia-500/30">
              <p className="text-base text-white">
                With <span className="text-fuchsia-400 font-bold">Alpha = 0.5</span>, the model serves two masters: <span className="text-purple-400">50% imitating the Teacher's reasoning</span>, <span className="text-cyan-400">50% adhering to the Dataset's truth</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Slide 10: Optimization Techniques */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-4xl px-6 text-center">
            <div className="inline-block border border-green-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <h2 className="text-sm font-bold text-green-400 uppercase tracking-[0.3em]">Optimization</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 header-font drop-shadow-lg">
              LoRA (Low-Rank Adaptation)
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Retraining a whole neural network is slow. So, we used LoRA.
            </p>
            <div className="glass-panel p-8 rounded-3xl">
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-500 line-through">100%</div>
                  <div className="text-xs text-slate-500">Full Model</div>
                </div>
                <div className="text-2xl text-white">→</div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-400">&lt; 1%</div>
                  <div className="text-xs text-green-400">Parameters Updated</div>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Instead of updating 100% of the model's brain, we only updated less than 1% of the parameters. We targeted the 'linear layers' which control adaptability. This allowed us to make the model smart without retraining it from scratch.
              </p>
            </div>
          </div>
        </div>

        {/* Slide 11: Deployment Pipeline */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-4xl px-6 text-center">
            <div className="inline-block border border-yellow-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-[0.3em]">Deployment</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 header-font drop-shadow-lg">
              Model Compression
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Finally, we had to get this model onto a laptop.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-2xl">
                <div className="text-2xl mb-2">🔗</div>
                <h3 className="font-bold text-white text-sm">Merge</h3>
                <p className="text-slate-400 text-xs">Merged training adapters</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl">
                <div className="text-2xl mb-2">📦</div>
                <h3 className="font-bold text-white text-sm">GGUF</h3>
                <p className="text-slate-400 text-xs">Converted format</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl">
                <div className="text-2xl mb-2">📉</div>
                <h3 className="font-bold text-white text-sm">Quantize</h3>
                <p className="text-slate-400 text-xs">16-bit → 4-bit</p>
              </div>
            </div>
            <div className="mt-8 glass-panel p-6 rounded-2xl border-yellow-500/30">
              <div className="flex justify-between items-center max-w-xs mx-auto">
                <span className="text-slate-500 line-through text-xl">3 GB</span>
                <span className="text-2xl text-white">→</span>
                <span className="text-yellow-400 font-bold text-3xl">934 MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 12: Backend Architecture */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-4xl px-6 text-center">
            <div className="inline-block border border-cyan-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-[0.3em]">Application</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 header-font drop-shadow-lg">
              Backend Architecture
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              We built an Intelligent Agent System using Python.
            </p>
            <div className="glass-panel p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-white mb-4">Lazy Loading</h3>
              <p className="text-slate-400 leading-relaxed">
                Efficiency is key, so we implemented 'Lazy Loading'. The AI model is not sitting in memory all the time. It is loaded only when grading is needed and unloaded immediately after to free up RAM for the user.
              </p>
            </div>
          </div>
        </div>

        {/* Slide 13: Context Management */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-4xl px-6 text-center">
            <div className="inline-block border border-teal-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
              <h2 className="text-sm font-bold text-teal-400 uppercase tracking-[0.3em]">Context</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 header-font drop-shadow-lg">
              Smart Truncation
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Small models have a small memory limit (context window). We cannot feed it a whole textbook.
            </p>
            <div className="glass-panel p-8 rounded-3xl">
              <div className="flex flex-col gap-4 max-w-md mx-auto">
                <div className="bg-emerald-500/20 p-4 rounded-lg border border-emerald-500/50 text-white font-bold">1. Rubric (Priority)</div>
                <div className="bg-teal-500/20 p-4 rounded-lg border border-teal-500/50 text-white font-bold">2. Student Answer</div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-slate-400">3. Relevant Textbook Parts</div>
              </div>
              <p className="text-slate-400 mt-6 text-sm">
                We built a smart truncation system that prioritizes critical information.
              </p>
            </div>
          </div>
        </div>

        {/* Slide 14: Multimodality */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-4xl px-6 text-center">
            <div className="inline-block border border-purple-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <h2 className="text-sm font-bold text-purple-400 uppercase tracking-[0.3em]">Multimodality</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500 header-font drop-shadow-lg">
              Voice Integration
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              We wanted to simulate real university oral exams.
            </p>
            <div className="glass-panel p-8 rounded-3xl flex items-center gap-8">
              <div className="text-6xl animate-pulse">🎙️</div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Web Speech API</h3>
                <p className="text-slate-400 leading-relaxed">
                  The student speaks, the browser transcribes the audio into text instantly, and then our local agent grades the text. It feels like a real conversation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 15: Quantitative Results */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-5xl px-6 text-center">
            <div className="inline-block border border-orange-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <h2 className="text-sm font-bold text-orange-400 uppercase tracking-[0.3em]">Results</h2>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 header-font drop-shadow-lg">
              Quantitative Results
            </h1>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                <div className="text-6xl font-bold text-emerald-400 mb-2">80%</div>
                <h3 className="text-xl font-bold text-white mb-2">Fidelity</h3>
                <p className="text-sm text-slate-400 mb-2">
                  Agreement rate with Teacher's Rubric
                </p>
                <p className="text-xs text-slate-500">
                  The Student agrees with the Teacher's grade 80% of the time.
                </p>
              </div>

              <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                <div className="text-6xl font-bold text-cyan-400 mb-2">4x</div>
                <h3 className="text-xl font-bold text-white mb-2">Speedup</h3>
                <p className="text-sm text-slate-400 mb-2">
                  CPU Inference Latency vs Cloud API
                </p>
                <p className="text-xs text-slate-500">
                  Faster inference on CPU compared to cloud-based models.
                </p>
              </div>

              <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                <div className="text-6xl font-bold text-purple-400 mb-2">70%</div>
                <h3 className="text-xl font-bold text-white mb-2">Disk Reduction</h3>
                <p className="text-sm text-slate-400">
                  Significant reduction in storage requirements.
                </p>
              </div>
            </div>

            {/* Qualitative Note */}
            <div className="mt-10 glass-panel p-6 rounded-2xl border-orange-500/30">
              <h3 className="text-lg font-bold text-orange-400 mb-2">Qualitative Insight</h3>
              <p className="text-slate-300">
                The model successfully <span className="text-white font-semibold">detects confident hallucinations</span> and provides strict, accurate grading.
              </p>
            </div>
          </div>
        </div>

        {/* Slide 16: Qualitative Results */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-4xl px-6 text-center">
            <div className="inline-block border border-rose-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <h2 className="text-sm font-bold text-rose-400 uppercase tracking-[0.3em]">Case Study</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500 header-font drop-shadow-lg">
              Qualitative Analysis
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Here is a real example from our testing.
            </p>
            <div className="glass-panel p-8 rounded-3xl text-left space-y-6">
              {/* The Question */}
              <div>
                <h3 className="text-white font-bold mb-2">The Question</h3>
                <p className="text-white">"What is overfitting and how can you prevent it?"</p>
              </div>

              {/* Student Answer */}
              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="text-yellow-400 font-bold mb-2">The Student Answer (The Common Misconception)</h3>
                <p className="text-slate-300 italic">"Overfitting is when the model performs great on training data. You can fix it by training for more epochs."</p>
              </div>

              {/* The Scenario */}
              <div>
                <h3 className="text-white font-bold mb-2">The Scenario</h3>
                <p className="text-white">The student gave a common misconception. A generic model might have let it slide.</p>
              </div>
              <div className="border-l-4 border-rose-500 pl-6">
                <h3 className="text-rose-400 font-bold mb-2">Edu-Distill Verdict</h3>
                <p className="text-white text-lg mb-2">Score: 5/30</p>
                <p className="text-slate-300 italic">"Our Edu-Distill model correctly identified the logical error. It was strict and accurate."</p>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 17: Challenges & Limitations */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-4xl px-6 text-center">
            <div className="inline-block border border-slate-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(148,163,184,0.2)]">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Honesty</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-gray-500 header-font drop-shadow-lg">
              Challenges & Limitations
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              We are honest about limitations.
            </p>
            <div className="grid gap-6 text-left">
              <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
                <span className="text-slate-500 font-bold text-xl">1.</span>
                <p className="text-slate-300">The context window is small, so we can't analyze massive books yet.</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
                <span className="text-slate-500 font-bold text-xl">2.</span>
                <p className="text-slate-300">If the Teacher model has bias, the Student inherits it.</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
                <span className="text-slate-500 font-bold text-xl">3.</span>
                <p className="text-slate-300">Converting to 4-bit does lose a tiny amount of linguistic quality.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 18: Future Works */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-5xl px-6 text-center">
            <div className="inline-block border border-emerald-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-[0.3em]">The Road Ahead</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 header-font drop-shadow-lg">
              Future Works
            </h1>
            <p className="text-xl text-slate-300 mb-10">
              We have ambitious plans to expand Edu-Distill's capabilities.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="glass-panel p-6 rounded-2xl text-left hover:border-emerald-500/50 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🖼️</div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Multimodal Support</h3>
                      <p className="text-sm text-slate-400">Enable grading of diagrams, charts, and handwritten work using vision models.</p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl text-left hover:border-emerald-500/50 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">📚</div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Larger Context Windows</h3>
                      <p className="text-sm text-slate-400">Expand from 4K to 32K tokens to handle entire textbooks and research papers.</p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl text-left hover:border-emerald-500/50 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🌍</div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Multi-Language Support</h3>
                      <p className="text-sm text-slate-400">Extend beyond English to support Spanish, French, German, and more.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="glass-panel p-6 rounded-2xl text-left hover:border-emerald-500/50 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🔌</div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">LMS Integration</h3>
                      <p className="text-sm text-slate-400">Build plugins for Moodle, Canvas, and Blackboard for seamless adoption.</p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl text-left hover:border-emerald-500/50 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🎯</div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Domain Specialization</h3>
                      <p className="text-sm text-slate-400">Create specialized models for STEM, humanities, and professional certifications.</p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl text-left hover:border-emerald-500/50 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">⚡</div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Edge Deployment</h3>
                      <p className="text-sm text-slate-400">Optimize for mobile devices and Raspberry Pi for maximum accessibility.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 18: Conclusion */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start">
          <div className="max-w-4xl px-6 text-center">
            <div className="inline-block border border-pink-500/30 rounded-full px-6 py-2 bg-slate-950/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
              <h2 className="text-sm font-bold text-pink-400 uppercase tracking-[0.3em]">Summary</h2>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-500 header-font drop-shadow-lg">
              Conclusion
            </h1>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed">
              In conclusion, Edu-Distill proves that you don't need a supercomputer to have smart AI. We successfully distilled 7 Billion parameters of reasoning into a laptop-ready model that protects user privacy.
            </p>

            <div className="flex flex-col items-center gap-8">
              <p className="text-white font-semibold">Thank you for listening.</p>
              <a
                href="https://github.com/nicogstar/Edu-Distill"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-full text-white font-semibold border border-slate-700 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all group"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                View Project on GitHub
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Slide 19: Live Demo */}
        <div className="h-screen w-full relative flex flex-col items-center justify-center snap-start bg-slate-950/50 backdrop-blur-sm overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

          <div className="w-full max-w-6xl px-6 mb-4 text-center pt-8">
            <div className="inline-block border border-cyan-500/30 rounded-full px-4 py-1.5 bg-slate-950/80 backdrop-blur-md mb-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.3em]">Live Demo</h2>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold header-font mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-lg">Conversational Grading</h2>
            <p className="text-slate-400 text-sm">Upload materials, answer questions, get instant AI-powered feedback.</p>
          </div>

          <ConversationalDashboard />
        </div>
      </div>
    </div>
  );
};

export default App;
