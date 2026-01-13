import React, { useState } from "react";
import {
  LayoutDashboard,
  Info,
  Calendar,
  Image,
  Edit2,
  Trash2,
  Plus,
  Phone,
  Users,
  Briefcase,
  GraduationCap,
  BarChart3,
  Film,
  FileText,
  LogOut,
  Loader2,
  RefreshCw,
  Star,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AdminLogin from "../components/AdminLogin";
import {
  useHeroContent,
  useAboutContent,
  useStatistics,
  useTeamMembers,
  useEvents,
  useGalleryImages,
  useFooterContent,
  useAdminDocuments,
  useStorageOperations,
} from "../hooks/useSupabaseData";
import { EditStatModal } from "../components/modals/EditStatModal";
import { EditHeroModal } from "../components/modals/EditHeroModal";
import { EditAboutModal } from "../components/modals/EditAboutModal";
import { TeamMemberModal } from "../components/modals/TeamMemberModal";
import { EventModal } from "../components/modals/EventModal";
import { GalleryUploadModal } from "../components/modals/GalleryUploadModal";
import { EditFooterModal } from "../components/modals/EditFooterModal";
import { DeleteConfirmModal } from "../components/modals/DeleteConfirmModal";
import { DocumentUploadModal } from "../components/modals/DocumentUploadModal";
import { supabase } from "../lib/supabase";
import type { TeamMember, Statistic, EventCard, GalleryImage } from "../types";

const Admin: React.FC = () => {
  const { isAdmin, isLoading: authLoading, signOut, user } = useAuth();
  const [activeSection, setActiveSection] = useState<string>("general");
  const { deleteFromStorage } = useStorageOperations();

  // Fetch data from Supabase
  const { data: heroContent, loading: heroLoading, refetch: refetchHero } = useHeroContent();
  const { data: aboutContent, loading: aboutLoading, refetch: refetchAbout } = useAboutContent();
  const { data: statistics, loading: statsLoading, refetch: refetchStats } = useStatistics();
  const { staffMembers, studentMembers, loading: teamLoading, refetch: refetchTeam } = useTeamMembers();
  const { data: events, loading: eventsLoading, refetch: refetchEvents } = useEvents();
  const { data: galleryImages, loading: galleryLoading, refetch: refetchGallery } = useGalleryImages();
  const { data: footerContent, loading: footerLoading, refetch: refetchFooter } = useFooterContent();
  const { data: adminDocuments, loading: documentsLoading, refetch: refetchDocuments } = useAdminDocuments();

  // Modal states
  const [editStatModal, setEditStatModal] = useState<{ isOpen: boolean; stat: Statistic | null }>({ isOpen: false, stat: null });
  const [editHeroModal, setEditHeroModal] = useState(false);
  const [editAboutModal, setEditAboutModal] = useState(false);
  const [editFooterModal, setEditFooterModal] = useState(false);
  const [teamMemberModal, setTeamMemberModal] = useState<{ isOpen: boolean; member?: TeamMember }>({ isOpen: false });
  const [eventModal, setEventModal] = useState<{ isOpen: boolean; event?: EventCard }>({ isOpen: false });
  const [galleryUploadModal, setGalleryUploadModal] = useState(false);
  const [documentUploadModal, setDocumentUploadModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  }>({ isOpen: false, title: '', message: '', onConfirm: async () => {} });

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated or not admin
  if (!isAdmin) {
    return <AdminLogin />;
  }

  const tabs = [
    { id: "general", label: "General", icon: LayoutDashboard, desc: "Stats & Team" },
    { id: "about", label: "About", icon: Info, desc: "About Page" },
    { id: "events", label: "Events", icon: Calendar, desc: "Manage Events" },
    { id: "gallery", label: "Gallery", icon: Image, desc: "Photos" },
    { id: "documents", label: "Documents", icon: FileText, desc: "Admin Files" },
  ];

  // Delete handlers
  const handleDeleteTeamMember = (member: TeamMember) => {
    setDeleteModal({
      isOpen: true,
      title: 'Delete Team Member',
      message: `Are you sure you want to delete ${member.name}? This action cannot be undone.`,
      onConfirm: async () => {
        const { error } = await supabase.from('team_members').delete().eq('id', member.id);
        if (error) throw error;
        refetchTeam();
      },
    });
  };

  const handleDeleteEvent = (event: EventCard) => {
    setDeleteModal({
      isOpen: true,
      title: 'Delete Event',
      message: `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        // Delete image from storage first
        if (event.image) {
          try {
            await deleteFromStorage('event-posters', event.image);
          } catch (err) {
            console.warn('Failed to delete event poster from storage:', err);
          }
        }
        
        const { error } = await supabase.from('events').delete().eq('id', event.id);
        if (error) throw error;
        refetchEvents();
      },
    });
  };

  const handleDeleteGalleryImage = (imageUrl: string, imageId: string, index: number) => {
    setDeleteModal({
      isOpen: true,
      title: 'Delete Image',
      message: `Are you sure you want to delete image #${index + 1}? This action cannot be undone.`,
      onConfirm: async () => {
        // Delete from storage first
        try {
          await deleteFromStorage('gallery', imageUrl);
        } catch (err) {
          console.warn('Failed to delete image from storage:', err);
        }

        const { error } = await supabase.from('gallery_images').delete().eq('id', imageId);
        if (error) throw error;
        refetchGallery();
      },
    });
  };

  const handleToggleFeatured = async (image: GalleryImage) => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_featured: !image.is_featured })
        .eq('id', image.id);
      
      if (error) throw error;
      refetchGallery();
    } catch (err) {
      console.error('Failed to toggle featured status:', err);
    }
  };

  const handleDeleteDocument = (documentUrl: string, documentName: string) => {
    setDeleteModal({
      isOpen: true,
      title: 'Delete Document',
      message: `Are you sure you want to delete "${documentName}"? This action cannot be undone.`,
      onConfirm: async () => {
        await deleteFromStorage('admin-documents', documentUrl);
        refetchDocuments();
      },
    });
  };

  const isLoading = heroLoading || aboutLoading || statsLoading || teamLoading || eventsLoading || galleryLoading || footerLoading || documentsLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ZYNORA Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your event website</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="text-sm font-semibold text-gray-900">{user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              data-testid="admin-logout-btn"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[89px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-all ${
                    activeSection === tab.id
                      ? "border-blue-600 text-blue-600 bg-blue-50/50"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  data-testid={`admin-tab-${tab.id}`}
                >
                  <Icon size={18} />
                  <div className="text-left">
                    <div className="font-semibold text-sm">{tab.label}</div>
                    <div className="text-xs opacity-70">{tab.desc}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        )}

        {!isLoading && (
          <>
            {/* GENERAL SECTION */}
            {activeSection === "general" && (
              <div className="space-y-6" data-testid="admin-section-general">
                {/* Statistics */}
                <section className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={20} className="text-gray-700" />
                      <h2 className="text-lg font-semibold text-gray-900">Statistics</h2>
                    </div>
                    <button
                      onClick={() => refetchStats()}
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {statistics.map((stat) => (
                      <div
                        key={stat.id}
                        className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                        data-testid={`stat-card-${stat.id}`}
                      >
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                          {stat.label}
                        </div>
                        <button
                          onClick={() => setEditStatModal({ isOpen: true, stat })}
                          className="w-full flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-3 py-2 rounded text-xs font-medium transition-colors border border-gray-200 hover:border-blue-300"
                          data-testid={`stat-edit-${stat.id}`}
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Hero Content */}
                {heroContent && (
                  <section className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-2">
                        <Film size={20} className="text-gray-700" />
                        <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
                      </div>
                      <button
                        onClick={() => setEditHeroModal(true)}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        data-testid="hero-edit-btn"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                        <div className="flex-1">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</label>
                          <div className="text-base font-semibold text-gray-900 mt-1">{heroContent.title}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                        <div className="flex-1">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Subtitle</label>
                          <div className="text-sm text-gray-700 mt-1">{heroContent.subtitle}</div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Team Members */}
                <section className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2">
                      <Users size={20} className="text-gray-700" />
                      <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                    </div>
                    <button
                      onClick={() => setTeamMemberModal({ isOpen: true })}
                      className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      data-testid="team-add-btn"
                    >
                      <Plus size={16} />
                      Add Member
                    </button>
                  </div>

                  {/* Staff Members */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase size={16} className="text-gray-600" />
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Staff Support</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {staffMembers.map((member) => (
                        <div
                          key={member.id}
                          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                          data-testid={`team-card-${member.id}`}
                        >
                          <div className="font-semibold text-gray-900">{member.name}</div>
                          <div className="text-sm text-blue-600 font-medium mt-0.5">{member.role}</div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                            <Phone size={12} />
                            {member.phone}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => setTeamMemberModal({ isOpen: true, member })}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-3 py-2 rounded text-xs font-medium transition-colors border border-gray-200 hover:border-blue-300"
                              data-testid={`team-edit-${member.id}`}
                            >
                              <Edit2 size={12} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTeamMember(member)}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 px-3 py-2 rounded text-xs font-medium transition-colors border border-gray-200 hover:border-red-300"
                              data-testid={`team-delete-${member.id}`}
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Student Members */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap size={16} className="text-gray-600" />
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Student Leads</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {studentMembers.map((member) => (
                        <div
                          key={member.id}
                          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                          data-testid={`team-card-${member.id}`}
                        >
                          <div className="font-semibold text-gray-900 text-sm">{member.name}</div>
                          <div className="text-xs text-blue-600 font-medium mt-0.5">{member.role}</div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                            <Phone size={11} />
                            {member.phone}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => setTeamMemberModal({ isOpen: true, member })}
                              className="flex-1 flex items-center justify-center gap-1 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-2 py-1.5 rounded text-xs font-medium transition-colors border border-gray-200 hover:border-blue-300"
                              data-testid={`team-edit-${member.id}`}
                            >
                              <Edit2 size={11} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTeamMember(member)}
                              className="flex items-center justify-center gap-1 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 px-2 py-1.5 rounded text-xs font-medium transition-colors border border-gray-200 hover:border-red-300"
                              data-testid={`team-delete-${member.id}`}
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Footer Content */}
                {footerContent && (
                  <section className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-2">
                        <FileText size={20} className="text-gray-700" />
                        <h2 className="text-lg font-semibold text-gray-900">Footer</h2>
                      </div>
                      <button
                        onClick={() => setEditFooterModal(true)}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        data-testid="footer-edit-btn"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                    </div>
                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="text-sm text-gray-700">{footerContent.copyrightText}</div>
                      {footerContent.note && (
                        <div className="text-xs text-gray-500 mt-1">{footerContent.note}</div>
                      )}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* ABOUT SECTION */}
            {activeSection === "about" && aboutContent && (
              <div className="space-y-6" data-testid="admin-section-about">
                <section className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2">
                      <Info size={20} className="text-gray-700" />
                      <h2 className="text-lg font-semibold text-gray-900">About Page Content</h2>
                    </div>
                    <button
                      onClick={() => setEditAboutModal(true)}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      data-testid="about-edit-btn"
                    >
                      <Edit2 size={16} />
                      Edit All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {aboutContent.paragraphs.map((paragraph, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                        data-testid={`about-paragraph-${index}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold">
                            Paragraph {index + 1}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{paragraph}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* EVENTS SECTION */}
            {activeSection === "events" && (
              <div className="space-y-6" data-testid="admin-section-events">
                <section className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2">
                      <Calendar size={20} className="text-gray-700" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Events</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Total: {events.length} events</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEventModal({ isOpen: true })}
                      className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      data-testid="event-add-btn"
                    >
                      <Plus size={16} />
                      Add Event
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                        data-testid={`event-card-${event.id}`}
                      >
                        {/* Event Image */}
                        <div className="relative h-40 overflow-hidden bg-gray-100">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-semibold shadow-sm text-gray-900">
                            Day {event.day}
                          </div>
                          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                            {event.vibe}
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="p-4">
                          <h3 className="text-base font-semibold text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{event.description}</p>

                          {/* Google Forms Link Status */}
                          <div className="mb-3">
                            {event.google_forms ? (
                              <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                                <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                                Registration Link Added
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                No Registration Link
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEventModal({ isOpen: true, event })}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-3 py-2 rounded text-xs font-medium transition-colors border border-gray-200 hover:border-blue-300"
                              data-testid={`event-edit-${event.id}`}
                            >
                              <Edit2 size={13} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event)}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 px-3 py-2 rounded text-xs font-medium transition-colors border border-gray-200 hover:border-red-300"
                              data-testid={`event-delete-${event.id}`}
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* GALLERY SECTION */}
            {activeSection === "gallery" && (
              <div className="space-y-6" data-testid="admin-section-gallery">
                <section className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2">
                      <Image size={20} className="text-gray-700" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Gallery</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Total: {galleryImages.length} images ({galleryImages.filter((img: GalleryImage) => img.is_featured).length} featured)
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setGalleryUploadModal(true)}
                      className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      data-testid="gallery-add-btn"
                    >
                      <Plus size={16} />
                      Add Image
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {galleryImages.map((image: GalleryImage, index) => (
                      <div
                        key={image.id}
                        className="group relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                        data-testid={`gallery-image-${index}`}
                      >
                        {/* Image */}
                        <div className="aspect-square">
                          <img
                            src={image.image_url}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Hover Overlay with Actions */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                          <button
                            onClick={() => handleToggleFeatured(image)}
                            className={`w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                              image.is_featured
                                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                : 'bg-gray-600 hover:bg-gray-700 text-white'
                            }`}
                            data-testid={`gallery-feature-${index}`}
                          >
                            <Star size={12} fill={image.is_featured ? 'currentColor' : 'none'} />
                            {image.is_featured ? 'Unfeature' : 'Feature'}
                          </button>
                          <button
                            onClick={() => handleDeleteGalleryImage(image.image_url, image.id, index)}
                            className="w-full flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded text-xs font-medium transition-colors"
                            data-testid={`gallery-remove-${index}`}
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </div>

                        {/* Image Number Badge */}
                        <div className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded text-xs font-semibold text-gray-700 shadow-sm">
                          #{index + 1}
                        </div>
                        
                        {/* Featured Badge */}
                        {image.is_featured && (
                          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-0.5 rounded text-xs font-semibold shadow-sm flex items-center gap-1">
                            <Star size={10} fill="currentColor" />
                            Featured
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* DOCUMENTS SECTION */}
            {activeSection === "documents" && (
              <div className="space-y-6" data-testid="admin-section-documents">
                <section className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2">
                      <FileText size={20} className="text-gray-700" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Admin Documents</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Total: {adminDocuments.length} documents</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDocumentUploadModal(true)}
                      className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      data-testid="document-add-btn"
                    >
                      <Plus size={16} />
                      Upload Document
                    </button>
                  </div>

                  {adminDocuments.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <FileText size={48} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-600 font-medium">No documents uploaded yet</p>
                      <p className="text-sm text-gray-500 mt-1">Upload PDF, DOC, or DOCX files</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {adminDocuments.map((doc, index) => (
                        <div
                          key={doc.id}
                          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                          data-testid={`document-card-${index}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-50 p-2 rounded">
                              <FileText size={24} className="text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">{doc.name}</h3>
                              <p className="text-xs text-gray-500 mt-1">
                                {(doc.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(doc.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded text-xs font-medium transition-colors border border-blue-200"
                              data-testid={`document-download-${index}`}
                            >
                              Download
                            </a>
                            <button
                              onClick={() => handleDeleteDocument(doc.url, doc.name)}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 px-3 py-2 rounded text-xs font-medium transition-colors border border-gray-200 hover:border-red-300"
                              data-testid={`document-delete-${index}`}
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {editStatModal.stat && (
        <EditStatModal
          isOpen={editStatModal.isOpen}
          onClose={() => setEditStatModal({ isOpen: false, stat: null })}
          stat={editStatModal.stat}
          onSuccess={refetchStats}
        />
      )}

      {heroContent && (
        <EditHeroModal
          isOpen={editHeroModal}
          onClose={() => setEditHeroModal(false)}
          hero={heroContent}
          onSuccess={refetchHero}
        />
      )}

      {aboutContent && (
        <EditAboutModal
          isOpen={editAboutModal}
          onClose={() => setEditAboutModal(false)}
          about={aboutContent}
          onSuccess={refetchAbout}
        />
      )}

      {footerContent && (
        <EditFooterModal
          isOpen={editFooterModal}
          onClose={() => setEditFooterModal(false)}
          footer={footerContent}
          onSuccess={refetchFooter}
        />
      )}

      <TeamMemberModal
        isOpen={teamMemberModal.isOpen}
        onClose={() => setTeamMemberModal({ isOpen: false })}
        member={teamMemberModal.member}
        onSuccess={refetchTeam}
      />

      <EventModal
        isOpen={eventModal.isOpen}
        onClose={() => setEventModal({ isOpen: false })}
        event={eventModal.event}
        onSuccess={refetchEvents}
      />

      <GalleryUploadModal
        isOpen={galleryUploadModal}
        onClose={() => setGalleryUploadModal(false)}
        onSuccess={refetchGallery}
      />

      <DocumentUploadModal
        isOpen={documentUploadModal}
        onClose={() => setDocumentUploadModal(false)}
        onSuccess={refetchDocuments}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={deleteModal.onConfirm}
        title={deleteModal.title}
        message={deleteModal.message}
      />
    </div>
  );
};

export default Admin;
