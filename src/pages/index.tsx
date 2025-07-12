import { useState, useEffect, useRef } from "react";
import LoginModal from "../components/loginModal";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ChatIcon from "@mui/icons-material/Chat";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
// import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { loadSlim } from "@tsparticles/slim";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useTheme } from "@mui/material/styles";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const sectionGradient = (from: string, to: string) => ({
  background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`,
});

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [particlesInit, setParticlesInit] = useState(false);

  // useEffect(() => {
  //   initParticlesEngine(async (engine) => {
  //     await loadSlim(engine);
  //   }).then(() => {
  //     setParticlesInit(true);
  //   });
  // }, []);

  const heroBoxRef = useRef<HTMLDivElement>(null);

  // Section in-view hooks
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [howItWorksRef, howItWorksInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [demoRef, demoInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [faqRef, faqInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  // Remove useThemeMode and useTheme imports
  // Hardcode dark theme colors
  const heroGradientFrom = "#232526";
  const heroGradientTo = "#414345";
  const particlesColors = ["#ffd54f", "#fff", "#90caf9"];
  const particlesLinkColor = "#ffd54f";

  return (
    <Box
      sx={{
        bgcolor: "#121212",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Hero Section (containerized) */}
      <Box
        sx={{
          position: "relative",
          minHeight: "80vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          ref={heroRef}
          sx={{
            ...sectionGradient(heroGradientFrom, heroGradientTo),
            pt: { xs: 10, md: 18 },
            pb: { xs: 8, md: 14 },
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: "100%",
            zIndex: 1,
          }}
        >
          {/* Interactive Particles Background - Temporarily disabled */}
          {/* {particlesInit && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                pointerEvents: "none",
              }}
            >
              <Particles
                id="tsparticles-hero"
                options={{
                  fullScreen: { enable: false },
                  fpsLimit: 120,
                  interactivity: {
                    detectsOn: "window",
                    events: {
                      onHover: { enable: true, mode: ["bubble", "repulse"] },
                      onClick: { enable: true, mode: ["repulse", "push"] },
                      resize: { enable: true },
                    },
                    modes: {
                      bubble: {
                        distance: 200,
                        duration: 2,
                        size: 12,
                        opacity: 0.8,
                      },
                      repulse: { distance: 200, duration: 0.4 },
                      push: { quantity: 6 },
                    },
                  },
                  particles: {
                    color: { value: particlesColors },
                    links: {
                      color: particlesLinkColor,
                      distance: 120,
                      enable: true,
                      opacity: 0.4,
                      width: 1,
                    },
                    move: {
                      direction: "none",
                      enable: true,
                      outModes: { default: "bounce" },
                      random: false,
                      speed: 2,
                      straight: false,
                    },
                    number: {
                      value: 80,
                    },
                    opacity: { value: 0.7 },
                    shape: { type: "circle" },
                    size: { value: { min: 2, max: 6 } },
                  },
                  detectRetina: true,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  inset: 0,
                }}
              />
            </Box>
          )} */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            style={{ position: "relative", zIndex: 1 }}
          >
            <Container maxWidth="md" sx={{ textAlign: "center" }}>
              <Typography
                variant="h2"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  mb: 2,
                  letterSpacing: 1,
                }}
              >
                Procastination
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: "rgba(255,255,255,0.85)", mb: 4, fontWeight: 400 }}
              >
                Supercharge your productivity with AI-powered video summaries,
                note-taking, and seamless session management.
              </Typography>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="contained"
                size="large"
                sx={{
                  color: "#121212",
                  bgcolor: "#fff",
                  fontWeight: 700,
                  px: 5,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "#e0e0e0" },
                }}
              >
                Get Started
              </Button>
            </Container>
          </motion.div>
        </Box>
      </Box>
      {/* Features Section and all other sections below are outside the hero container */}

      {/* Features Section */}
      <Box
        ref={featuresRef}
        sx={{
          ...sectionGradient("#414345", "#232526"),
          py: { xs: 8, md: 12 },
        }}
      >
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 600,
                mb: 4,
                textAlign: "center",
              }}
            >
              Features
            </Typography>
            <Grid container spacing={5} justifyContent="center">
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "rgba(66,66,66,0.95)",
                    textAlign: "center",
                    borderRadius: 3,
                    boxShadow: 6,
                  }}
                  elevation={8}
                >
                  <OndemandVideoIcon
                    sx={{ fontSize: 44, color: "#90caf9", mb: 1 }}
                  />
                  <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                    AI Video Summaries
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#bbb" }}>
                    Instantly get concise, AI-generated summaries of YouTube
                    videos using Gemini.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "rgba(66,66,66,0.95)",
                    textAlign: "center",
                    borderRadius: 3,
                    boxShadow: 6,
                  }}
                  elevation={8}
                >
                  <NoteAddIcon sx={{ fontSize: 44, color: "#a5d6a7", mb: 1 }} />
                  <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                    Smart Notepad
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#bbb" }}>
                    Take notes while watching videos and keep your thoughts
                    organized in one place.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "rgba(66,66,66,0.95)",
                    textAlign: "center",
                    borderRadius: 3,
                    boxShadow: 6,
                  }}
                  elevation={8}
                >
                  <ChatIcon sx={{ fontSize: 44, color: "#f48fb1", mb: 1 }} />
                  <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                    AI Chat
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#bbb" }}>
                    Ask questions and chat with AI about the video content for
                    deeper understanding.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "rgba(66,66,66,0.95)",
                    textAlign: "center",
                    borderRadius: 3,
                    boxShadow: 6,
                  }}
                  elevation={8}
                >
                  <PlaylistPlayIcon
                    sx={{ fontSize: 44, color: "#ffd54f", mb: 1 }}
                  />
                  <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                    Session Management
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#bbb" }}>
                    Organize your learning with sessions and playlists. Track
                    your progress easily.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </motion.div>
      </Box>

      {/* How It Works Section */}
      <Box
        ref={howItWorksRef}
        sx={{
          ...sectionGradient("#232526", "#23252600"),
          py: { xs: 8, md: 12 },
        }}
      >
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={howItWorksInView ? "visible" : "hidden"}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 600,
                mb: 3,
                textAlign: "center",
              }}
            >
              How It Works
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              alignItems="stretch"
            >
              {/* Left: Demo Video Placeholder */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: { xs: 3, md: 0 },
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", md: 320 },
                    minHeight: { xs: 120, md: 220 },
                    border: "2px dashed #ffd54f",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(255,255,255,0.03)",
                    color: "#ffd54f",
                    fontWeight: 600,
                    fontSize: "1.2rem",
                  }}
                >
                  {/* Leave blank for now, or add text: Demo video coming soon! */}
                </Box>
              </Box>
              {/* Right: Steps */}
              <Box sx={{ flex: 2 }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={4}
                  divider={
                    <Divider
                      flexItem
                      orientation="vertical"
                      sx={{ borderColor: "#444" }}
                    />
                  }
                >
                  <Box sx={{ flex: 1, textAlign: "center" }}>
                    <Typography variant="h6" sx={{ color: "#90caf9", mb: 1 }}>
                      1. Sign Up & Login
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                      Create your free account to get started and access all
                      features.
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, textAlign: "center" }}>
                    <Typography variant="h6" sx={{ color: "#a5d6a7", mb: 1 }}>
                      2. Add YouTube Videos
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                      Add videos or playlists to your sessions and let AI
                      summarize them for you.
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, textAlign: "center" }}>
                    <Typography variant="h6" sx={{ color: "#ffd54f", mb: 1 }}>
                      3. Take Notes & Chat
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                      Take notes, chat with AI, and organize your learning
                      efficiently.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Container>
        </motion.div>
      </Box>

      {/* Testimonials Section */}
      <Box
        ref={testimonialsRef}
        sx={{
          ...sectionGradient("#23252600", "#232526"),
          py: { xs: 8, md: 12 },
        }}
      >
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={testimonialsInView ? "visible" : "hidden"}
        >
          <Container maxWidth="md">
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 600,
                mb: 6,
                textAlign: "center",
              }}
            >
              What Users Say
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    bgcolor: "rgba(66,66,66,0.95)",
                    boxShadow: 3,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: "#90caf9" }}>A</Avatar>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "white", fontWeight: 500 }}
                    >
                      Alex, Student
                    </Typography>
                  </Stack>
                  <Typography variant="body1" sx={{ color: "#bbb" }}>
                    “Procastination helped me summarize hours of lectures and
                    keep my notes organized. The AI chat is a game changer!”
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    bgcolor: "rgba(66,66,66,0.95)",
                    boxShadow: 3,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: "#ffd54f", color: "#232526" }}>
                      J
                    </Avatar>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "white", fontWeight: 500 }}
                    >
                      Jamie, Content Creator
                    </Typography>
                  </Stack>
                  <Typography variant="body1" sx={{ color: "#bbb" }}>
                    “I use Procastination to quickly get the gist of videos and
                    brainstorm ideas with the AI. Highly recommended!”
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </motion.div>
      </Box>

      {/* Call to Action Section */}
      <Box
        ref={ctaRef}
        sx={{
          ...sectionGradient("#232526", "#232526 80%"),
          py: { xs: 8, md: 12 },
          textAlign: "center",
        }}
      >
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
        >
          <Container maxWidth="sm">
            <Typography
              variant="h4"
              sx={{ color: "white", fontWeight: 700, mb: 3 }}
            >
              Ready to boost your productivity?
            </Typography>
            <Typography variant="h6" sx={{ color: "#bbb", mb: 5 }}>
              Sign up now and start learning smarter with Procastination.
            </Typography>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="contained"
              size="large"
              sx={{
                color: "#121212",
                bgcolor: "#ffd54f",
                fontWeight: 700,
                px: 5,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1.1rem",
                boxShadow: 2,
                "&:hover": { bgcolor: "#ffe082" },
              }}
            >
              Get Started Free
            </Button>
          </Container>
        </motion.div>
      </Box>

      {/* FAQ Section */}
      <Box
        ref={faqRef}
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: "#232526",
          borderTop: "2px solid #ffd54f",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          mt: -6,
          zIndex: 1,
        }}
      >
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={faqInView ? "visible" : "hidden"}
        >
          <Container maxWidth="md">
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 700,
                mb: 4,
                textAlign: "center",
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Accordion
              sx={{ bgcolor: "rgba(66,66,66,0.95)", color: "#fff", mb: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#ffd54f" }} />}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  What is Procastination?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Procastination is an AI-powered platform to help you summarize
                  videos, take notes, and manage your learning sessions
                  efficiently.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{ bgcolor: "rgba(66,66,66,0.95)", color: "#fff", mb: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#ffd54f" }} />}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  Is it free to use?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Yes! You can get started for free and access all core
                  features. Premium features may be added in the future.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{ bgcolor: "rgba(66,66,66,0.95)", color: "#fff", mb: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#ffd54f" }} />}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  Can I use it on mobile?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Absolutely! Procastination is fully responsive and works great
                  on mobile devices.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{ bgcolor: "rgba(66,66,66,0.95)", color: "#fff", mb: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#ffd54f" }} />}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  How do I add a video?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Simply sign up, create a session, and add YouTube video links
                  or playlists. The AI will handle the rest!
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Container>
        </motion.div>
      </Box>

      {/* Login Modal */}
      <LoginModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
}
