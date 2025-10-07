# Product Requirements Document (PRD)
## Environmental Monitoring Mobile Application

---

## 1. Executive Summary

### 1.1 Product Overview
Convert the existing web-based environmental monitoring system into a native mobile application using Capacitor, enabling growers and technicians to monitor, record, and analyze environmental metrics on-the-go with offline capabilities.

### 1.2 Target Users
- **Growers**: Farm owners and operators who need to monitor environmental conditions
- **Technicians**: Field specialists who collect and input environmental data
- **Administrators**: System administrators who manage users and system configuration

### 1.3 Business Goals
- Increase field data collection efficiency by 60%
- Enable offline data collection and syncing
- Provide real-time alerts and notifications
- Improve data accuracy through mobile-first input methods
- Reduce response time to environmental anomalies

---

## 2. Current State Analysis

### 2.1 Existing Web Features
- User authentication (currently localStorage-based)
- Dashboard with real-time environmental metrics
- Data entry forms for manual input
- Historical data visualization
- PDF report generation
- Standards comparison
- Role-based access (grower/technician)

### 2.2 Technology Stack
- React 18.3
- TypeScript
- Tailwind CSS
- React Router
- Recharts for visualization
- jsPDF for reports
- Vite build system

---

## 3. Mobile App Objectives

### 3.1 Primary Goals
1. **Native Experience**: Leverage device capabilities (camera, GPS, sensors)
2. **Offline-First**: Full functionality without internet connectivity
3. **Real-Time Sync**: Automatic data synchronization when online
4. **Push Notifications**: Alerts for threshold violations
5. **Enhanced UX**: Mobile-optimized UI/UX for field use

### 3.2 Success Metrics
- 90% of users complete data entry in under 2 minutes
- 95% offline data sync success rate
- <3 second app launch time
- 4.5+ star rating on app stores
- 70% daily active user rate

---

## 4. Feature Requirements

### 4.1 Authentication & Security

#### 4.1.1 Authentication Methods
- **Primary**: Email/password authentication
- **Biometric**: Face ID / Touch ID / Fingerprint
- **Session Management**: Secure token storage in device keychain
- **Auto-logout**: Configurable timeout (default: 30 minutes)

#### 4.1.2 Security Requirements
- End-to-end encryption for data transmission
- Secure local storage using device encryption
- Certificate pinning for API calls
- Jailbreak/root detection
- Secure credential storage (no localStorage)

### 4.2 Dashboard & Monitoring

#### 4.2.1 Real-Time Metrics
- Temperature (indoor/outdoor)
- Humidity levels
- CO2 concentration
- Light intensity
- Air quality index
- Soil moisture (for growers)

#### 4.2.2 Visualization
- Live metric cards with trend indicators
- Interactive charts (last 24h, 7d, 30d)
- Color-coded status indicators
- Threshold violation alerts
- Swipe gestures for navigation

#### 4.2.3 Offline Capabilities
- Cache last 7 days of data
- Display last known values when offline
- Queue actions for sync when online
- Offline indicator in header

### 4.3 Data Entry & Collection

#### 4.3.1 Manual Entry
- Quick-entry forms optimized for mobile
- Numeric keyboard for measurements
- Auto-save drafts locally
- Batch entry mode
- Voice-to-text notes

#### 4.3.2 Device Integration
- **Camera**: Photo capture for visual records
- **GPS**: Auto-location tagging
- **Sensors**: Device temperature/pressure sensors
- **Barcode Scanner**: Equipment/location identification
- **NFC**: Tap-to-log at sensor stations

#### 4.3.3 Data Validation
- Real-time field validation
- Range checking against standards
- Required field enforcement
- Duplicate entry prevention

### 4.4 Reports & Analytics

#### 4.4.1 Historical Data
- Date range selection with calendar picker
- Filterable by metric type
- Exportable data tables
- Trend analysis

#### 4.4.2 PDF Generation
- Generate reports offline
- Share via email/messaging apps
- Cloud storage integration
- Custom report templates

#### 4.4.3 Standards Comparison
- Industry benchmark comparisons
- Performance scoring
- Compliance status
- Actionable recommendations

### 4.5 Notifications & Alerts

#### 4.5.1 Push Notifications
- Critical threshold violations
- Data sync completion
- Report generation ready
- System maintenance alerts

#### 4.5.2 In-App Alerts
- Toast messages for actions
- Modal alerts for critical issues
- Badge counts for unread items

#### 4.5.3 User Preferences
- Notification settings per metric
- Quiet hours configuration
- Alert frequency controls

### 4.6 Profile & Settings

#### 4.6.1 User Profile
- Profile information management
- Role display (non-editable)
- Activity history
- Data usage statistics

#### 4.6.2 App Settings
- Theme (light/dark/auto)
- Unit preferences (metric/imperial)
- Language selection
- Data sync frequency
- Cache management

---

## 5. Database Schema

### 5.1 Schema Overview
```
┌─────────────────┐
│   auth.users    │ (Supabase Auth)
└────────┬────────┘
         │
         ├──────────────┬──────────────┬───────────────┐
         │              │              │               │
    ┌────▼─────┐   ┌───▼──────┐  ┌───▼──────┐   ┌───▼──────┐
    │ profiles │   │user_roles│  │ sites    │   │ devices  │
    └────┬─────┘   └──────────┘  └────┬─────┘   └────┬─────┘
         │                             │              │
         │         ┌───────────────────┴──────────────┤
         │         │                                  │
    ┌────▼─────────▼────┐                    ┌───────▼──────┐
    │  metric_readings   │                    │device_calibr.│
    └────────┬───────────┘                    └──────────────┘
             │
        ┌────┴────┬──────────┬──────────┐
        │         │          │          │
   ┌────▼────┐┌──▼──────┐┌──▼──────┐┌──▼──────┐
   │ alerts  ││ reports ││ photos  ││sync_log │
   └─────────┘└─────────┘└─────────┘└─────────┘
```

### 5.2 Table Definitions

#### 5.2.1 User Management Tables

```sql
-- ============================================
-- USER ROLES (SECURITY CRITICAL)
-- ============================================

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'grower', 'technician');

-- User roles table (MUST be separate for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE (user_id, role)
);

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
        AND role = _role
        AND (expires_at IS NULL OR expires_at > NOW())
    )
$$;

-- ============================================
-- USER PROFILES
-- ============================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    company TEXT,
    department TEXT,
    preferred_language TEXT DEFAULT 'en',
    preferred_units TEXT DEFAULT 'metric', -- 'metric' or 'imperial'
    timezone TEXT DEFAULT 'UTC',
    notification_preferences JSONB DEFAULT '{
        "push_enabled": true,
        "email_enabled": true,
        "alert_threshold_violations": true,
        "alert_sync_complete": false,
        "alert_reports_ready": true,
        "quiet_hours_start": "22:00",
        "quiet_hours_end": "07:00"
    }'::jsonb,
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

#### 5.2.2 Location & Site Management

```sql
-- ============================================
-- SITES / LOCATIONS
-- ============================================

CREATE TABLE public.sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    site_type TEXT NOT NULL, -- 'greenhouse', 'field', 'warehouse', 'processing'
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    area_sqm DECIMAL(10, 2),
    owner_id UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'active', -- 'active', 'inactive', 'maintenance'
    metadata JSONB, -- custom fields per site
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site access control
CREATE TABLE public.site_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    access_level TEXT NOT NULL, -- 'read', 'write', 'admin'
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (site_id, user_id)
);
```

#### 5.2.3 Devices & Sensors

```sql
-- ============================================
-- DEVICES & SENSORS
-- ============================================

CREATE TABLE public.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_code TEXT UNIQUE NOT NULL, -- QR/Barcode identifier
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    device_type TEXT NOT NULL, -- 'temperature', 'humidity', 'co2', 'light', 'soil'
    manufacturer TEXT,
    model TEXT,
    serial_number TEXT,
    install_date DATE,
    last_calibration_date DATE,
    calibration_interval_days INT DEFAULT 90,
    status TEXT DEFAULT 'active', -- 'active', 'maintenance', 'offline', 'retired'
    location_description TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Device calibration history
CREATE TABLE public.device_calibrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    calibrated_by UUID REFERENCES auth.users(id),
    calibration_date TIMESTAMPTZ DEFAULT NOW(),
    calibration_values JSONB NOT NULL,
    notes TEXT,
    next_calibration_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5.2.4 Metric Readings (Core Data)

```sql
-- ============================================
-- METRIC READINGS
-- ============================================

CREATE TABLE public.metric_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
    device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
    recorded_by UUID REFERENCES auth.users(id),
    
    -- Metric details
    metric_type TEXT NOT NULL, -- 'temperature', 'humidity', 'co2', 'light', 'air_quality'
    value DECIMAL(10, 4) NOT NULL,
    unit TEXT NOT NULL, -- 'celsius', 'fahrenheit', 'percent', 'ppm', 'lux'
    
    -- Context
    reading_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_accuracy DECIMAL(6, 2), -- meters
    
    -- Data quality
    quality_score INT CHECK (quality_score BETWEEN 0 AND 100),
    is_validated BOOLEAN DEFAULT FALSE,
    validated_by UUID REFERENCES auth.users(id),
    validated_at TIMESTAMPTZ,
    
    -- Sync metadata
    recorded_offline BOOLEAN DEFAULT FALSE,
    device_timestamp TIMESTAMPTZ, -- device local time when recorded
    synced_at TIMESTAMPTZ,
    
    -- Additional data
    notes TEXT,
    tags TEXT[],
    metadata JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX idx_metric_readings_site_time ON public.metric_readings(site_id, reading_time DESC);
CREATE INDEX idx_metric_readings_type_time ON public.metric_readings(metric_type, reading_time DESC);
CREATE INDEX idx_metric_readings_device ON public.metric_readings(device_id, reading_time DESC);
CREATE INDEX idx_metric_readings_recorded_by ON public.metric_readings(recorded_by, reading_time DESC);
```

#### 5.2.5 Photos & Attachments

```sql
-- ============================================
-- PHOTOS & ATTACHMENTS
-- ============================================

CREATE TABLE public.photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
    metric_reading_id UUID REFERENCES public.metric_readings(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES auth.users(id),
    
    -- File details
    storage_path TEXT NOT NULL, -- path in Supabase Storage
    file_name TEXT NOT NULL,
    file_size INT, -- bytes
    mime_type TEXT,
    
    -- Photo metadata
    caption TEXT,
    taken_at TIMESTAMPTZ,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    
    -- Device info
    device_model TEXT,
    camera_settings JSONB,
    
    -- Processing
    thumbnail_path TEXT,
    is_processed BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photos_site ON public.photos(site_id, created_at DESC);
CREATE INDEX idx_photos_reading ON public.photos(metric_reading_id);
```

#### 5.2.6 Alerts & Notifications

```sql
-- ============================================
-- ALERTS & THRESHOLDS
-- ============================================

CREATE TABLE public.alert_thresholds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    
    -- Threshold values
    min_value DECIMAL(10, 4),
    max_value DECIMAL(10, 4),
    
    -- Alert configuration
    severity TEXT NOT NULL, -- 'info', 'warning', 'critical'
    notification_enabled BOOLEAN DEFAULT TRUE,
    notification_channels TEXT[] DEFAULT ARRAY['push', 'email'],
    
    -- Timing
    cooldown_minutes INT DEFAULT 60, -- prevent alert spam
    active_hours_start TIME,
    active_hours_end TIME,
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    threshold_id UUID REFERENCES public.alert_thresholds(id) ON DELETE CASCADE,
    metric_reading_id UUID REFERENCES public.metric_readings(id) ON DELETE SET NULL,
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
    
    -- Alert details
    alert_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    metric_value DECIMAL(10, 4),
    threshold_exceeded TEXT, -- 'min' or 'max'
    
    -- Status
    status TEXT DEFAULT 'active', -- 'active', 'acknowledged', 'resolved', 'dismissed'
    acknowledged_by UUID REFERENCES auth.users(id),
    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    
    -- Notification tracking
    notifications_sent JSONB, -- track which notifications were sent
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_site_status ON public.alerts(site_id, status, created_at DESC);
CREATE INDEX idx_alerts_active ON public.alerts(status) WHERE status = 'active';
```

#### 5.2.7 Reports & Analytics

```sql
-- ============================================
-- REPORTS
-- ============================================

CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
    generated_by UUID REFERENCES auth.users(id),
    
    -- Report details
    report_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'custom', 'compliance'
    title TEXT NOT NULL,
    description TEXT,
    
    -- Date range
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Content
    report_data JSONB NOT NULL, -- structured report data
    summary JSONB, -- executive summary
    
    -- File
    pdf_storage_path TEXT,
    file_size INT,
    
    -- Sharing
    shared_with UUID[], -- array of user IDs
    is_public BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_site_date ON public.reports(site_id, start_date DESC);
CREATE INDEX idx_reports_user ON public.reports(generated_by, created_at DESC);
```

#### 5.2.8 Sync & Offline Management

```sql
-- ============================================
-- SYNC MANAGEMENT
-- ============================================

CREATE TABLE public.sync_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Action details
    action_type TEXT NOT NULL, -- 'create_reading', 'update_reading', 'delete_reading', 'upload_photo'
    table_name TEXT NOT NULL,
    record_data JSONB NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    retry_count INT DEFAULT 0,
    last_error TEXT,
    
    -- Timing
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    
    -- Device info
    device_id TEXT,
    app_version TEXT
);

CREATE INDEX idx_sync_queue_user_status ON public.sync_queue(user_id, status);

-- Sync history/log
CREATE TABLE public.sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    
    -- Sync details
    sync_type TEXT NOT NULL, -- 'auto', 'manual', 'background'
    items_synced INT DEFAULT 0,
    items_failed INT DEFAULT 0,
    data_size_bytes INT,
    
    -- Timing
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    duration_ms INT,
    
    -- Device info
    device_id TEXT,
    app_version TEXT,
    connection_type TEXT, -- 'wifi', 'cellular', 'unknown'
    
    error_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sync_log_user_date ON public.sync_log(user_id, started_at DESC);
```

#### 5.2.9 Standards & Compliance

```sql
-- ============================================
-- INDUSTRY STANDARDS
-- ============================================

CREATE TABLE public.industry_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Standard identification
    standard_name TEXT NOT NULL,
    standard_code TEXT UNIQUE NOT NULL, -- e.g., 'ISO_9001', 'ORGANIC_EU'
    version TEXT,
    industry TEXT, -- 'agriculture', 'greenhouse', 'organic'
    region TEXT, -- 'US', 'EU', 'GLOBAL'
    
    -- Thresholds
    metric_type TEXT NOT NULL,
    min_value DECIMAL(10, 4),
    max_value DECIMAL(10, 4),
    optimal_min DECIMAL(10, 4),
    optimal_max DECIMAL(10, 4),
    unit TEXT NOT NULL,
    
    -- Metadata
    description TEXT,
    compliance_level TEXT, -- 'mandatory', 'recommended', 'best_practice'
    reference_url TEXT,
    
    -- Validity
    effective_from DATE,
    effective_until DATE,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_standards_active ON public.industry_standards(is_active, industry, metric_type);
```

### 5.3 Row Level Security (RLS) Policies

```sql
-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER ROLES POLICIES
-- ============================================

-- Admins can manage all roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid());

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- SITES POLICIES
-- ============================================

-- Admins can do everything with sites
CREATE POLICY "Admins can manage all sites"
ON public.sites FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Growers can manage their own sites
CREATE POLICY "Growers can manage their sites"
ON public.sites FOR ALL
TO authenticated
USING (
    public.has_role(auth.uid(), 'grower') 
    AND (owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.site_access 
        WHERE site_id = sites.id 
        AND user_id = auth.uid() 
        AND access_level IN ('write', 'admin')
    ))
);

-- Technicians can view sites they have access to
CREATE POLICY "Technicians can view accessible sites"
ON public.sites FOR SELECT
TO authenticated
USING (
    public.has_role(auth.uid(), 'technician')
    AND EXISTS (
        SELECT 1 FROM public.site_access 
        WHERE site_id = sites.id 
        AND user_id = auth.uid()
    )
);

-- ============================================
-- METRIC READINGS POLICIES
-- ============================================

-- Users can view readings from sites they have access to
CREATE POLICY "Users can view accessible readings"
ON public.metric_readings FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.site_access 
        WHERE site_id = metric_readings.site_id 
        AND user_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
);

-- Technicians can insert readings for accessible sites
CREATE POLICY "Technicians can insert readings"
ON public.metric_readings FOR INSERT
TO authenticated
WITH CHECK (
    (public.has_role(auth.uid(), 'technician') OR public.has_role(auth.uid(), 'grower'))
    AND EXISTS (
        SELECT 1 FROM public.site_access 
        WHERE site_id = metric_readings.site_id 
        AND user_id = auth.uid()
        AND access_level IN ('write', 'admin')
    )
);

-- Users can update their own readings
CREATE POLICY "Users can update their own readings"
ON public.metric_readings FOR UPDATE
TO authenticated
USING (recorded_by = auth.uid());

-- ============================================
-- SYNC QUEUE POLICIES
-- ============================================

-- Users can only access their own sync queue
CREATE POLICY "Users manage their own sync queue"
ON public.sync_queue FOR ALL
TO authenticated
USING (user_id = auth.uid());
```

### 5.4 Database Functions & Triggers

```sql
-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply to all tables with updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.sites FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.devices FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.metric_readings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.alerts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to check alert thresholds
CREATE OR REPLACE FUNCTION public.check_alert_thresholds()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_threshold RECORD;
    v_last_alert TIMESTAMPTZ;
BEGIN
    -- Loop through active thresholds for this site and metric
    FOR v_threshold IN 
        SELECT * FROM public.alert_thresholds
        WHERE site_id = NEW.site_id
        AND metric_type = NEW.metric_type
        AND notification_enabled = TRUE
    LOOP
        -- Check if value exceeds thresholds
        IF (v_threshold.min_value IS NOT NULL AND NEW.value < v_threshold.min_value)
        OR (v_threshold.max_value IS NOT NULL AND NEW.value > v_threshold.max_value) THEN
            
            -- Check cooldown period
            SELECT MAX(created_at) INTO v_last_alert
            FROM public.alerts
            WHERE threshold_id = v_threshold.id
            AND status = 'active';
            
            IF v_last_alert IS NULL 
            OR v_last_alert < NOW() - (v_threshold.cooldown_minutes || ' minutes')::INTERVAL THEN
                
                -- Create alert
                INSERT INTO public.alerts (
                    threshold_id,
                    metric_reading_id,
                    site_id,
                    alert_type,
                    severity,
                    title,
                    message,
                    metric_value,
                    threshold_exceeded
                ) VALUES (
                    v_threshold.id,
                    NEW.id,
                    NEW.site_id,
                    NEW.metric_type,
                    v_threshold.severity,
                    'Threshold Violation: ' || NEW.metric_type,
                    'Value ' || NEW.value || ' exceeded threshold',
                    NEW.value,
                    CASE 
                        WHEN NEW.value < v_threshold.min_value THEN 'min'
                        ELSE 'max'
                    END
                );
            END IF;
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER check_thresholds_on_reading
    AFTER INSERT ON public.metric_readings
    FOR EACH ROW
    EXECUTE FUNCTION public.check_alert_thresholds();
```

### 5.5 Storage Buckets

```sql
-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES
    ('photos', 'photos', false),
    ('reports', 'reports', false),
    ('avatars', 'avatars', true);

-- Storage policies for photos
CREATE POLICY "Users can upload photos to accessible sites"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'photos'
    AND (storage.foldername(name))[1] IN (
        SELECT id::text FROM public.sites
        WHERE EXISTS (
            SELECT 1 FROM public.site_access
            WHERE site_id = sites.id
            AND user_id = auth.uid()
            AND access_level IN ('write', 'admin')
        )
    )
);

CREATE POLICY "Users can view photos from accessible sites"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'photos'
    AND (storage.foldername(name))[1] IN (
        SELECT id::text FROM public.sites
        WHERE EXISTS (
            SELECT 1 FROM public.site_access
            WHERE site_id = sites.id
            AND user_id = auth.uid()
        )
        OR public.has_role(auth.uid(), 'admin')
    )
);
```

---

## 6. Technical Architecture

### 6.1 Mobile Framework
**Technology**: Capacitor 6.x
- Cross-platform (iOS & Android)
- Native API access
- Web-to-native bridge
- Hot reload support during development

### 6.2 Frontend Architecture
```
src/
├── capacitor/
│   ├── plugins/          # Custom native plugins
│   ├── hooks/            # Capacitor lifecycle hooks
│   └── config.ts         # Capacitor configuration
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── data-entry/
│   ├── reports/
│   └── settings/
├── services/
│   ├── api/              # API client
│   ├── sync/             # Offline sync service
│   ├── storage/          # Local storage abstraction
│   ├── notifications/    # Push notification service
│   └── sensors/          # Device sensor integration
├── stores/               # State management (Zustand/Context)
├── hooks/                # Custom React hooks
└── utils/
```

### 6.3 State Management Strategy
- **Global State**: Zustand or React Context
- **Server State**: TanStack Query (React Query)
- **Local Storage**: IndexedDB via Dexie.js
- **Form State**: React Hook Form

### 6.4 Offline Architecture

#### 6.4.1 Data Flow
```
User Action → Local State → IndexedDB → Sync Queue → Backend API
     ↓                                         ↓
   UI Update ← Optimistic Update      Success/Conflict Handler
```

#### 6.4.2 Sync Strategy
- **Background Sync**: Every 5 minutes when connected
- **Manual Sync**: User-triggered refresh
- **Conflict Resolution**: Last-write-wins with manual review option
- **Queue Priority**: Critical alerts > readings > photos

### 6.5 Native Capabilities Integration

#### Required Capacitor Plugins
```json
{
  "@capacitor/app": "^6.0.0",
  "@capacitor/camera": "^6.0.0",
  "@capacitor/geolocation": "^6.0.0",
  "@capacitor/push-notifications": "^6.0.0",
  "@capacitor/local-notifications": "^6.0.0",
  "@capacitor/network": "^6.0.0",
  "@capacitor/storage": "^1.0.0",
  "@capacitor/filesystem": "^6.0.0",
  "@capacitor/haptics": "^6.0.0",
  "@capacitor/status-bar": "^6.0.0",
  "@capacitor/splash-screen": "^6.0.0"
}
```

---

## 7. User Experience Requirements

### 7.1 Performance Targets
- App launch: <3 seconds
- Page transitions: <200ms
- Data sync: <5 seconds for 100 readings
- Image upload: <10 seconds on 3G
- Offline mode switch: <100ms

### 7.2 Mobile UI/UX Guidelines

#### 7.2.1 Touch Targets
- Minimum tap target: 44x44 points
- Spacing between targets: ≥8px
- Primary actions: Bottom 1/3 of screen
- Swipe gestures for navigation

#### 7.2.2 Input Optimization
- Native keyboards for specific inputs
- Auto-capitalization where appropriate
- Input masks for formatted data
- Voice input for notes/descriptions

#### 7.2.3 Loading States
- Skeleton screens for initial load
- Progress indicators for sync
- Optimistic updates for user actions
- Pull-to-refresh on lists

### 7.3 Navigation Structure
```
Bottom Tab Navigation:
├── Dashboard (Home icon)
├── Data Entry (Plus icon)
├── Reports (Chart icon)
└── Profile (User icon)

Stack Navigation per Tab:
├── Dashboard
│   ├── Home
│   ├── Site Detail
│   ├── Device Detail
│   └── Alert Detail
├── Data Entry
│   ├── Entry Form
│   ├── Camera Capture
│   └── Entry History
├── Reports
│   ├── Report List
│   ├── Historical Data
│   ├── Standards Comparison
│   └── PDF Viewer
└── Profile
    ├── Profile Info
    ├── Settings
    └── About
```

---

## 8. Security Requirements

### 8.1 Authentication Security
- ✅ Supabase Auth (email/password)
- ✅ JWT tokens stored in secure keychain
- ✅ Biometric authentication (Face ID/Touch ID)
- ✅ Auto-logout after 30 minutes inactivity
- ✅ Session refresh token rotation
- ❌ NO localStorage for credentials
- ❌ NO hardcoded API keys in code

### 8.2 Data Security
- All API calls over HTTPS
- Certificate pinning for production
- End-to-end encryption for sensitive data
- Local database encryption (SQLCipher)
- Secure file storage
- Sanitized error messages (no stack traces to users)

### 8.3 Role-Based Access Control (RBAC)
```
Admin:
  ✓ Manage all users, sites, devices
  ✓ View all data
  ✓ Configure system settings
  ✓ Generate compliance reports

Grower:
  ✓ Manage owned sites
  ✓ View all data for owned sites
  ✓ Assign technicians to sites
  ✓ Generate reports
  ✓ Configure alerts

Technician:
  ✓ View assigned sites
  ✓ Enter/edit own readings
  ✓ Upload photos
  ✓ View reports (read-only)
  ✗ Cannot modify site settings
```

### 8.4 API Security
- Rate limiting: 100 requests/minute per user
- Request signing for critical operations
- IP whitelisting for admin operations
- Audit logging for all data modifications

---

## 9. Testing Requirements

### 9.1 Testing Pyramid
```
         /\
        /E2E\         10% - End-to-end tests
       /------\
      /  Integ  \     20% - Integration tests
     /----------\
    /   Unit      \   70% - Unit tests
   /--------------\
```

### 9.2 Test Coverage Targets
- Unit tests: >80% coverage
- Integration tests: Critical paths
- E2E tests: User flows
- Performance tests: Load & stress
- Security tests: Penetration testing

### 9.3 Device Testing Matrix
| Device Type | iOS Version | Android Version | Priority |
|-------------|-------------|-----------------|----------|
| iPhone 13+ | iOS 16+ | - | High |
| iPhone SE | iOS 15+ | - | Medium |
| Samsung Galaxy S21+ | - | Android 12+ | High |
| Google Pixel 6+ | - | Android 12+ | High |
| Mid-range Android | - | Android 11+ | Medium |

---

## 10. Deployment Strategy

### 10.1 Build Configuration

#### Development
```javascript
// capacitor.config.ts (development)
{
  appId: 'app.lovable.a4f54b864d2241f9aa9c90b6c1af91a0',
  appName: 'EnviroMonitor Dev',
  server: {
    url: 'https://a4f54b86-4d22-41f9-aa9c-90b6c1af91a0.lovableproject.com',
    cleartext: true
  }
}
```

#### Production
```javascript
// capacitor.config.ts (production)
{
  appId: 'com.enviromonitor.app',
  appName: 'EnviroMonitor',
  // No server config for production
}
```

### 10.2 CI/CD Pipeline
```yaml
Pipeline Stages:
1. Code Quality
   - ESLint
   - TypeScript check
   - Prettier

2. Testing
   - Unit tests
   - Integration tests
   - E2E tests

3. Build
   - Web build (npm run build)
   - iOS build (Xcode)
   - Android build (Gradle)

4. Deploy
   - TestFlight (iOS)
   - Internal testing (Android)
   - Production release
```

### 10.3 Release Checklist
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Performance benchmarks met
- [ ] Changelog updated
- [ ] Screenshots updated
- [ ] Privacy policy reviewed
- [ ] Terms of service updated
- [ ] Beta testing completed
- [ ] App store metadata ready
- [ ] Support documentation updated

---

## 11. Analytics & Monitoring

### 11.1 Key Metrics to Track
- Daily/Monthly Active Users (DAU/MAU)
- Session duration
- Feature adoption rates
- Sync success/failure rates
- Crash rates
- API response times
- Offline usage patterns
- User retention (Day 1, 7, 30)

### 11.2 Error Tracking
- Crash reporting (Sentry)
- ANR detection (Android)
- Network error tracking
- Sync conflict logging
- User-reported issues

### 11.3 Usage Analytics
- Screen view tracking
- Button click events
- Data entry completion rates
- Report generation frequency
- Photo upload success rates

---

## 12. Phase-wise Implementation

### Phase 1: Foundation (Weeks 1-4)
**Goal**: Mobile app with core features

- [x] Capacitor setup
- [ ] Authentication with Supabase
- [ ] Database schema implementation
- [ ] RLS policies
- [ ] Basic mobile UI/UX
- [ ] Dashboard with real-time metrics
- [ ] Simple data entry form
- [ ] User profile management

**Deliverable**: Functional mobile app with basic CRUD operations

### Phase 2: Offline & Sync (Weeks 5-8)
**Goal**: Full offline capabilities

- [ ] IndexedDB integration
- [ ] Sync queue implementation
- [ ] Background sync service
- [ ] Conflict resolution
- [ ] Network status detection
- [ ] Optimistic UI updates
- [ ] Sync status indicators

**Deliverable**: App works fully offline with auto-sync

### Phase 3: Native Features (Weeks 9-12)
**Goal**: Leverage device capabilities

- [ ] Camera integration
- [ ] GPS location tagging
- [ ] Push notifications setup
- [ ] Local notifications
- [ ] Biometric authentication
- [ ] Barcode/QR scanner
- [ ] Device sensor integration
- [ ] Haptic feedback

**Deliverable**: Native mobile experience

### Phase 4: Reports & Analytics (Weeks 13-16)
**Goal**: Advanced data analysis

- [ ] Historical data viewer
- [ ] PDF report generation (offline)
- [ ] Standards comparison
- [ ] Chart visualizations
- [ ] Data export functionality
- [ ] Report sharing
- [ ] Compliance reports

**Deliverable**: Complete reporting system

### Phase 5: Alerts & Monitoring (Weeks 17-20)
**Goal**: Proactive monitoring

- [ ] Alert threshold configuration
- [ ] Real-time alert detection
- [ ] Push notification delivery
- [ ] Alert management dashboard
- [ ] Alert history
- [ ] Notification preferences
- [ ] Quiet hours

**Deliverable**: Comprehensive alert system

### Phase 6: Polish & Optimization (Weeks 21-24)
**Goal**: Production-ready app

- [ ] Performance optimization
- [ ] Battery usage optimization
- [ ] App size reduction
- [ ] Accessibility improvements
- [ ] Localization (i18n)
- [ ] Comprehensive testing
- [ ] App store preparation
- [ ] Documentation

**Deliverable**: App Store & Play Store submission

---

## 13. Success Criteria

### 13.1 Technical Metrics
- ✅ <3s app launch time
- ✅ >95% sync success rate
- ✅ <1% crash rate
- ✅ >80% code coverage
- ✅ Zero critical security vulnerabilities
- ✅ App size <50MB

### 13.2 Business Metrics
- ✅ 70% user adoption within 3 months
- ✅ 4.0+ star rating
- ✅ 60% reduction in data entry time
- ✅ 80% of data entered offline
- ✅ 90% user satisfaction score

### 13.3 User Feedback Goals
- "App is fast and responsive"
- "Offline mode works flawlessly"
- "Easy to enter data in the field"
- "Notifications are timely and useful"
- "Reports are comprehensive"

---

## 14. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Sync conflicts | High | Medium | Implement robust conflict resolution with manual review option |
| Battery drain | Medium | High | Optimize background sync, use efficient data structures |
| Device compatibility | High | Medium | Extensive testing on device matrix, graceful degradation |
| App store rejection | High | Low | Follow guidelines strictly, thorough pre-submission review |
| Data loss | Critical | Low | Implement local backup, sync queue persistence |
| Security breach | Critical | Low | Regular security audits, penetration testing |
| Poor network performance | Medium | High | Aggressive caching, data compression, resumable uploads |

---

## 15. Post-Launch Plan

### 15.1 Immediate (First Month)
- Monitor crash reports daily
- Track user feedback
- Hot-fix critical bugs
- Analyze usage patterns
- Optimize performance bottlenecks

### 15.2 Short-term (Months 2-6)
- Add requested features
- Improve onboarding flow
- Enhance offline capabilities
- Expand device integrations
- Implement user suggestions

### 15.3 Long-term (6+ Months)
- AI-powered insights
- Predictive analytics
- Multi-language support
- Tablet-optimized UI
- Apple Watch / Wear OS apps
- IoT device integrations

---

## 16. Appendices

### 16.1 Glossary
- **RLS**: Row Level Security
- **RBAC**: Role-Based Access Control
- **E2E**: End-to-End
- **PWA**: Progressive Web App
- **JWT**: JSON Web Token
- **ANR**: Application Not Responding

### 16.2 References
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Best Practices](https://reactnative.dev/docs/getting-started)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android Material Design](https://m3.material.io/)

### 16.3 Contact & Stakeholders
- **Product Owner**: [Name]
- **Technical Lead**: [Name]
- **Mobile Developer**: [Name]
- **Backend Developer**: [Name]
- **QA Lead**: [Name]
- **UI/UX Designer**: [Name]

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-07  
**Status**: Draft for Review  
**Next Review Date**: 2025-10-21
