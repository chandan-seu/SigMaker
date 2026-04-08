import React from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { SignatureData, SectionId, SocialLink } from '../types';
import { 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  Globe, 
  Image as ImageIcon, 
  Share2, 
  Star, 
  Type, 
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Settings2,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  data: SignatureData;
  onChange: (data: SignatureData) => void;
  onReset: () => void;
}

interface SortableSectionProps {
  id: SectionId;
  data: SignatureData;
  onChange: (data: SignatureData) => void;
  isOverlay?: boolean;
  key?: React.Key;
}

const SortableSection = ({ 
  id, 
  data, 
  onChange,
  isOverlay = false
}: SortableSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const updateField = (field: keyof SignatureData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const toggleSection = (sectionId: SectionId) => {
    onChange({
      ...data,
      enabledSections: {
        ...data.enabledSections,
        [sectionId]: !data.enabledSections[sectionId]
      }
    });
  };

  const toggleExpand = (sectionId: SectionId) => {
    onChange({
      ...data,
      expandedSections: {
        ...data.expandedSections,
        [sectionId]: !data.expandedSections[sectionId]
      }
    });
  };

  const handleImageUpload = (field: 'profileImage' | 'companyLogo' | 'trustpilotBadge', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSocialLink = (linkId: string, updates: Partial<SocialLink>) => {
    const newLinks = data.socialLinks.map(link => 
      link.id === linkId ? { ...link, ...updates } : link
    );
    updateField('socialLinks', newLinks);
  };

  const addContactItem = (field: 'phones' | 'emails' | 'websites') => {
    updateField(field, [...data[field], '']);
  };

  const removeContactItem = (field: 'phones' | 'emails' | 'websites', index: number) => {
    const newList = [...data[field]];
    newList.splice(index, 1);
    updateField(field, newList);
  };

  const updateContactItem = (field: 'phones' | 'emails' | 'websites', index: number, value: string) => {
    const newList = [...data[field]];
    newList[index] = value;
    updateField(field, newList);
  };

  const sectionConfig: Record<SectionId, { title: string; icon: any }> = {
    profile: { title: 'Profile Image', icon: ImageIcon },
    'name-title': { title: 'Name & Title', icon: User },
    company: { title: 'Company Info', icon: Briefcase },
    contact: { title: 'Contact Info', icon: Phone },
    social: { title: 'Social Icons', icon: Share2 },
    trustpilot: { title: 'Trustpilot Badge', icon: Star },
    'custom-text': { title: 'Custom Text', icon: Type }
  };

  const { title, icon: Icon } = sectionConfig[id];
  const isEnabled = data.enabledSections[id];
  const isExpanded = data.expandedSections[id];

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "bg-white border rounded-xl mb-4 transition-shadow overflow-hidden",
        isDragging ? "shadow-none border-gray-200" : "shadow-sm border-gray-100",
        isOverlay && "shadow-2xl border-blue-500 ring-2 ring-blue-500/20"
      )}
    >
      <div className={cn(
        "p-2 flex items-center justify-between bg-gray-50/50 border-b border-gray-100",
        !isEnabled && "opacity-60"
      )}>
        <div className="flex items-center gap-2 flex-1">
          <button 
            {...attributes} 
            {...listeners}
            className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={16} />
          </button>
          <div className="p-1.5 bg-white rounded-lg border border-gray-100 text-gray-600">
            <Icon size={16} />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-0.5">
          <button 
            onClick={() => toggleSection(id)}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              isEnabled ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:bg-gray-100"
            )}
            title={isEnabled ? "Disable Section" : "Enable Section"}
          >
            {isEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button 
            onClick={() => toggleExpand(id)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isEnabled && isExpanded && !isDragging && (
        <div className="p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {id === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                  {data.profileImage ? (
                    <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="text-gray-400" />
                  )}
                </div>
                <label className="flex-1">
                  <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer text-center transition-colors">
                    Upload Image
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('profileImage', e)} />
                </label>
                {data.profileImage && (
                  <button onClick={() => updateField('profileImage', '')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Size ({data.profileSize}px)</label>
                  <input type="range" min="40" max="150" value={data.profileSize} onChange={(e) => updateField('profileSize', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Radius ({data.profileRadius}%)</label>
                  <input type="range" min="0" max="50" value={data.profileRadius} onChange={(e) => updateField('profileRadius', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
              </div>
            </div>
          )}

          {id === 'name-title' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                  <input type="color" value={data.nameColor} onChange={(e) => updateField('nameColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent" />
                </div>
                <input type="text" value={data.fullName} onChange={(e) => updateField('fullName', e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Job Title</label>
                  <input type="color" value={data.titleColor} onChange={(e) => updateField('titleColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent" />
                </div>
                <input type="text" value={data.jobTitle} onChange={(e) => updateField('jobTitle', e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          )}

          {id === 'company' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Company Name</label>
                  <input type="color" value={data.companyColor} onChange={(e) => updateField('companyColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent" />
                </div>
                <input type="text" value={data.companyName} onChange={(e) => updateField('companyName', e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Company Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                    {data.companyLogo ? <img src={data.companyLogo} alt="Logo" className="w-full h-full object-contain" /> : <Briefcase className="text-gray-400" />}
                  </div>
                  <label className="flex-1">
                    <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer text-center transition-colors">Upload Logo</div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('companyLogo', e)} />
                  </label>
                </div>
                {data.companyLogo && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Logo Size ({data.logoSize}px)</label>
                      <input type="range" min="40" max="200" value={data.logoSize} onChange={(e) => updateField('logoSize', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Logo Radius ({data.logoRadius}px)</label>
                      <input type="range" min="0" max="20" value={data.logoRadius} onChange={(e) => updateField('logoRadius', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {id === 'contact' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Text Color</label>
                <input type="color" value={data.contactColor} onChange={(e) => updateField('contactColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Numbers</label>
                  <button onClick={() => addContactItem('phones')} className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                {data.phones.map((phone, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input type="text" value={phone} onChange={(e) => updateContactItem('phones', idx, e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    {data.phones.length > 1 && (
                      <button onClick={() => removeContactItem('phones', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Addresses</label>
                  <button onClick={() => addContactItem('emails')} className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                {data.emails.map((email, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input type="email" value={email} onChange={(e) => updateContactItem('emails', idx, e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    {data.emails.length > 1 && (
                      <button onClick={() => removeContactItem('emails', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Websites</label>
                  <button onClick={() => addContactItem('websites')} className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                {data.websites.map((website, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="relative flex-1">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input type="text" value={website} onChange={(e) => updateContactItem('websites', idx, e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    {data.websites.length > 1 && (
                      <button onClick={() => removeContactItem('websites', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {id === 'social' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Icon Color</label>
                <input type="color" value={data.socialIconColor} onChange={(e) => updateField('socialIconColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent" />
              </div>
              {data.socialLinks.map((link) => (
                <div key={link.id} className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{link.platform}</span>
                    <button onClick={() => updateSocialLink(link.id, { enabled: !link.enabled })} className={cn("text-[10px] font-bold px-2 py-1 rounded uppercase", link.enabled ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600")}>{link.enabled ? 'Enabled' : 'Disabled'}</button>
                  </div>
                  {link.enabled && <input type="text" value={link.url} onChange={(e) => updateSocialLink(link.id, { url: e.target.value })} placeholder={`${link.platform} URL`} className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded outline-none" />}
                </div>
              ))}
            </div>
          )}

          {id === 'trustpilot' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Review URL</label>
                <input type="text" value={data.trustpilotUrl} onChange={(e) => updateField('trustpilotUrl', e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Badge Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-12 rounded bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center p-2">
                    {data.trustpilotBadge ? <img src={data.trustpilotBadge} alt="Trustpilot" className="w-full h-full object-contain" /> : <Star className="text-gray-400" />}
                  </div>
                  <label className="flex-1">
                    <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer text-center transition-colors">Upload Badge</div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('trustpilotBadge', e)} />
                  </label>
                </div>
                {data.trustpilotBadge && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Badge Size ({data.trustpilotSize}px)</label>
                    <input type="range" min="60" max="250" value={data.trustpilotSize} onChange={(e) => updateField('trustpilotSize', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                )}
              </div>
            </div>
          )}

          {id === 'custom-text' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Content</label>
                  <input type="color" value={data.customTextColor} onChange={(e) => updateField('customTextColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent" />
                </div>
                <textarea value={data.customText} onChange={(e) => updateField('customText', e.target.value)} rows={3} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const UnifiedEditor: React.FC<Props> = ({ data, onChange, onReset }) => {
  const [activeId, setActiveId] = React.useState<SectionId | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as SectionId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = data.sections.indexOf(active.id as SectionId);
      const newIndex = data.sections.indexOf(over.id as SectionId);
      onChange({
        ...data,
        sections: arrayMove(data.sections, oldIndex, newIndex)
      });
    }
  };

  const updateField = (field: keyof SignatureData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/30">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900">Editor</h2>
          <button 
            onClick={onReset}
            className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Reset All
          </button>
        </div>

        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
          <SortableContext 
            items={data.sections}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {data.sections.map((id) => (
                <SortableSection 
                  key={id} 
                  id={id} 
                  data={data} 
                  onChange={onChange} 
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.5',
                },
              },
            }),
          }}>
            {activeId ? (
              <SortableSection 
                id={activeId} 
                data={data} 
                onChange={onChange} 
                isOverlay 
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Global Design Section - Always at bottom, not sortable */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4 mt-6">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
            <Settings2 size={18} className="text-blue-600" />
            Global Design
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Font Family</label>
              <select value={data.fontFamily} onChange={(e) => updateField('fontFamily', e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none">
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
                <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Section Spacing ({data.globalSpacing}px)</label>
              <input type="range" min="0" max="40" value={data.globalSpacing} onChange={(e) => updateField('globalSpacing', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Alignment</label>
              <div className="flex gap-2">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button key={align} onClick={() => updateField('globalAlign', align)} className={cn("flex-1 py-2 text-sm font-medium rounded-lg border transition-all", data.globalAlign === align ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50")}>
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-white text-center">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
          © {new Date().getFullYear()} Ignite Tech Solutions. All rights reserved.
        </p>
      </div>
    </div>
  );
};
