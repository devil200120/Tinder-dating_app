import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      siteName: "LoveConnect",
      siteDescription:
        "Find your perfect match with our premium dating platform",
      supportEmail: "support@loveconnect.com",
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: true,
      maxFileSize: 5,
      allowedFileTypes: ["jpg", "jpeg", "png", "gif"],
    },
    security: {
      passwordMinLength: 8,
      requireStrongPassword: true,
      twoFactorAuth: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      ipBlocking: true,
      dataEncryption: true,
      auditLogs: true,
    },
    moderation: {
      autoModeration: true,
      profanityFilter: true,
      imageModeration: true,
      reportThreshold: 3,
      suspensionDuration: 7,
      reviewQueueLimit: 100,
      escalationThreshold: 5,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      newMatchNotifications: true,
      messageNotifications: true,
      reportNotifications: true,
      systemAlerts: true,
      maintenanceAlerts: true,
    },
    matching: {
      ageRange: { min: 18, max: 80 },
      distanceRange: 50,
      premiumBoost: true,
      superLikes: 5,
      dailyLikes: 100,
      rewindFeature: true,
      locationAccuracy: "city",
    },
    billing: {
      currency: "USD",
      taxRate: 8.5,
      subscriptionPlans: {
        basic: 9.99,
        premium: 19.99,
        platinum: 29.99,
      },
      paymentGateway: "stripe",
      recurringBilling: true,
      trialPeriod: 7,
    },
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const tabs = [
    {
      id: "general",
      name: "General",
      icon: "⚙️",
      color: "from-slate-600 to-slate-700",
    },
    {
      id: "security",
      name: "Security",
      icon: "🔒",
      color: "from-emerald-600 to-teal-600",
    },
    {
      id: "moderation",
      name: "Moderation",
      icon: "🛡️",
      color: "from-indigo-600 to-purple-600",
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: "🔔",
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "matching",
      name: "Matching",
      icon: "💝",
      color: "from-rose-500 to-pink-600",
    },
    {
      id: "billing",
      name: "Billing",
      icon: "💳",
      color: "from-green-600 to-emerald-600",
    },
  ];

  const updateSetting = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setHasChanges(false);
    setSaving(false);
  };

  const handleReset = () => {
    // Reset to default values
    window.location.reload();
  };

  const SettingsCard = ({ title, description, children, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="p-4">{children}</div>
    </motion.div>
  );

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-start justify-between py-2">
      <div className="flex-1 mr-4">
        <label className="text-sm font-medium text-gray-800">{label}</label>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${
          enabled
            ? "bg-gradient-to-r from-slate-500 to-slate-600"
            : "bg-gray-300"
        }`}
      >
        <motion.span
          animate={{ x: enabled ? 18 : 2 }}
          className="inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform duration-200"
        />
      </motion.button>
    </div>
  );

  const InputField = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    min,
    max,
  }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(type === "number" ? Number(e.target.value) : e.target.value)
        }
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-sm"
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-4">
      <SettingsCard
        title="Site Configuration"
        description="Basic website settings and information"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Site Name"
            value={settings.general.siteName}
            onChange={(value) => updateSetting("general", "siteName", value)}
            placeholder="Enter site name"
          />
          <InputField
            label="Support Email"
            value={settings.general.supportEmail}
            onChange={(value) =>
              updateSetting("general", "supportEmail", value)
            }
            type="email"
            placeholder="support@example.com"
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-900">
            Site Description
          </label>
          <textarea
            value={settings.general.siteDescription}
            onChange={(e) =>
              updateSetting("general", "siteDescription", e.target.value)
            }
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 mt-1"
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="System Settings"
        description="Core system functionality controls"
      >
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.general.maintenanceMode}
            onChange={(value) =>
              updateSetting("general", "maintenanceMode", value)
            }
            label="Maintenance Mode"
            description="Enable to temporarily disable site access for maintenance"
          />
          <ToggleSwitch
            enabled={settings.general.registrationEnabled}
            onChange={(value) =>
              updateSetting("general", "registrationEnabled", value)
            }
            label="User Registration"
            description="Allow new users to create accounts"
          />
          <ToggleSwitch
            enabled={settings.general.emailVerificationRequired}
            onChange={(value) =>
              updateSetting("general", "emailVerificationRequired", value)
            }
            label="Email Verification Required"
            description="Require users to verify their email before activation"
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="File Upload Settings"
        description="Configure file upload parameters"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Max File Size (MB)"
            value={settings.general.maxFileSize}
            onChange={(value) => updateSetting("general", "maxFileSize", value)}
            type="number"
            min="1"
            max="100"
          />
        </div>
      </SettingsCard>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-4">
      <SettingsCard
        title="Password Security"
        description="Configure password requirements and policies"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Minimum Password Length"
              value={settings.security.passwordMinLength}
              onChange={(value) =>
                updateSetting("security", "passwordMinLength", value)
              }
              type="number"
              min="6"
              max="20"
            />
            <InputField
              label="Max Login Attempts"
              value={settings.security.maxLoginAttempts}
              onChange={(value) =>
                updateSetting("security", "maxLoginAttempts", value)
              }
              type="number"
              min="3"
              max="10"
            />
          </div>
          <ToggleSwitch
            enabled={settings.security.requireStrongPassword}
            onChange={(value) =>
              updateSetting("security", "requireStrongPassword", value)
            }
            label="Require Strong Passwords"
            description="Enforce uppercase, lowercase, numbers, and special characters"
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Authentication & Access"
        description="Session and access control settings"
      >
        <div className="space-y-4">
          <InputField
            label="Session Timeout (minutes)"
            value={settings.security.sessionTimeout}
            onChange={(value) =>
              updateSetting("security", "sessionTimeout", value)
            }
            type="number"
            min="15"
            max="480"
          />
          <ToggleSwitch
            enabled={settings.security.twoFactorAuth}
            onChange={(value) =>
              updateSetting("security", "twoFactorAuth", value)
            }
            label="Two-Factor Authentication"
            description="Enable 2FA for admin accounts"
          />
          <ToggleSwitch
            enabled={settings.security.ipBlocking}
            onChange={(value) => updateSetting("security", "ipBlocking", value)}
            label="IP Address Blocking"
            description="Block suspicious IP addresses automatically"
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Data Protection"
        description="Data security and privacy settings"
      >
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.security.dataEncryption}
            onChange={(value) =>
              updateSetting("security", "dataEncryption", value)
            }
            label="Data Encryption"
            description="Encrypt sensitive user data at rest"
          />
          <ToggleSwitch
            enabled={settings.security.auditLogs}
            onChange={(value) => updateSetting("security", "auditLogs", value)}
            label="Audit Logging"
            description="Log all admin actions for security auditing"
          />
        </div>
      </SettingsCard>
    </div>
  );

  const renderModerationSettings = () => (
    <div className="space-y-4">
      <SettingsCard
        title="Automatic Moderation"
        description="AI-powered content moderation settings"
      >
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.moderation.autoModeration}
            onChange={(value) =>
              updateSetting("moderation", "autoModeration", value)
            }
            label="Enable Auto-Moderation"
            description="Automatically flag inappropriate content using AI"
          />
          <ToggleSwitch
            enabled={settings.moderation.profanityFilter}
            onChange={(value) =>
              updateSetting("moderation", "profanityFilter", value)
            }
            label="Profanity Filter"
            description="Filter out inappropriate language in messages and profiles"
          />
          <ToggleSwitch
            enabled={settings.moderation.imageModeration}
            onChange={(value) =>
              updateSetting("moderation", "imageModeration", value)
            }
            label="Image Content Moderation"
            description="Scan uploaded images for inappropriate content"
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Report Handling"
        description="Configure how user reports are processed"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Report Threshold"
            value={settings.moderation.reportThreshold}
            onChange={(value) =>
              updateSetting("moderation", "reportThreshold", value)
            }
            type="number"
            min="1"
            max="10"
          />
          <InputField
            label="Suspension Duration (days)"
            value={settings.moderation.suspensionDuration}
            onChange={(value) =>
              updateSetting("moderation", "suspensionDuration", value)
            }
            type="number"
            min="1"
            max="30"
          />
          <InputField
            label="Review Queue Limit"
            value={settings.moderation.reviewQueueLimit}
            onChange={(value) =>
              updateSetting("moderation", "reviewQueueLimit", value)
            }
            type="number"
            min="50"
            max="1000"
          />
        </div>
      </SettingsCard>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      <SettingsCard
        title="User Notifications"
        description="Configure what notifications users receive"
      >
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.notifications.emailNotifications}
            onChange={(value) =>
              updateSetting("notifications", "emailNotifications", value)
            }
            label="Email Notifications"
            description="Send notifications via email"
          />
          <ToggleSwitch
            enabled={settings.notifications.pushNotifications}
            onChange={(value) =>
              updateSetting("notifications", "pushNotifications", value)
            }
            label="Push Notifications"
            description="Send mobile push notifications"
          />
          <ToggleSwitch
            enabled={settings.notifications.smsNotifications}
            onChange={(value) =>
              updateSetting("notifications", "smsNotifications", value)
            }
            label="SMS Notifications"
            description="Send SMS notifications for critical alerts"
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Notification Types"
        description="Control which events trigger notifications"
      >
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.notifications.newMatchNotifications}
            onChange={(value) =>
              updateSetting("notifications", "newMatchNotifications", value)
            }
            label="New Match Notifications"
            description="Notify users when they get a new match"
          />
          <ToggleSwitch
            enabled={settings.notifications.messageNotifications}
            onChange={(value) =>
              updateSetting("notifications", "messageNotifications", value)
            }
            label="Message Notifications"
            description="Notify users of new messages"
          />
          <ToggleSwitch
            enabled={settings.notifications.reportNotifications}
            onChange={(value) =>
              updateSetting("notifications", "reportNotifications", value)
            }
            label="Report Notifications"
            description="Notify admins of new user reports"
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="System Alerts"
        description="Administrative notification settings"
      >
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.notifications.systemAlerts}
            onChange={(value) =>
              updateSetting("notifications", "systemAlerts", value)
            }
            label="System Alerts"
            description="Get notified of system issues and errors"
          />
          <ToggleSwitch
            enabled={settings.notifications.maintenanceAlerts}
            onChange={(value) =>
              updateSetting("notifications", "maintenanceAlerts", value)
            }
            label="Maintenance Alerts"
            description="Get notified before scheduled maintenance"
          />
        </div>
      </SettingsCard>
    </div>
  );

  const renderMatchingSettings = () => (
    <div className="space-y-4">
      <SettingsCard
        title="Matching Algorithm"
        description="Configure the matching system parameters"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Default Distance Range (km)"
              value={settings.matching.distanceRange}
              onChange={(value) =>
                updateSetting("matching", "distanceRange", value)
              }
              type="number"
              min="5"
              max="500"
            />
            <SelectField
              label="Location Accuracy"
              value={settings.matching.locationAccuracy}
              onChange={(value) =>
                updateSetting("matching", "locationAccuracy", value)
              }
              options={[
                { value: "exact", label: "Exact Location" },
                { value: "city", label: "City Level" },
                { value: "region", label: "Region Level" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Minimum Age"
              value={settings.matching.ageRange.min}
              onChange={(value) =>
                updateSetting("matching", "ageRange", {
                  ...settings.matching.ageRange,
                  min: value,
                })
              }
              type="number"
              min="18"
              max="100"
            />
            <InputField
              label="Maximum Age"
              value={settings.matching.ageRange.max}
              onChange={(value) =>
                updateSetting("matching", "ageRange", {
                  ...settings.matching.ageRange,
                  max: value,
                })
              }
              type="number"
              min="18"
              max="100"
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Premium Features"
        description="Configure premium user features and limits"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Daily Likes Limit"
              value={settings.matching.dailyLikes}
              onChange={(value) =>
                updateSetting("matching", "dailyLikes", value)
              }
              type="number"
              min="10"
              max="1000"
            />
            <InputField
              label="Super Likes per Day"
              value={settings.matching.superLikes}
              onChange={(value) =>
                updateSetting("matching", "superLikes", value)
              }
              type="number"
              min="1"
              max="50"
            />
          </div>
          <ToggleSwitch
            enabled={settings.matching.premiumBoost}
            onChange={(value) =>
              updateSetting("matching", "premiumBoost", value)
            }
            label="Premium Profile Boost"
            description="Allow premium users to boost their profile visibility"
          />
          <ToggleSwitch
            enabled={settings.matching.rewindFeature}
            onChange={(value) =>
              updateSetting("matching", "rewindFeature", value)
            }
            label="Rewind Feature"
            description="Allow users to undo their last swipe action"
          />
        </div>
      </SettingsCard>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-4">
      <SettingsCard
        title="Payment Configuration"
        description="Configure payment processing settings"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Currency"
              value={settings.billing.currency}
              onChange={(value) => updateSetting("billing", "currency", value)}
              options={[
                { value: "USD", label: "US Dollar (USD)" },
                { value: "EUR", label: "Euro (EUR)" },
                { value: "GBP", label: "British Pound (GBP)" },
                { value: "CAD", label: "Canadian Dollar (CAD)" },
              ]}
            />
            <InputField
              label="Tax Rate (%)"
              value={settings.billing.taxRate}
              onChange={(value) => updateSetting("billing", "taxRate", value)}
              type="number"
              min="0"
              max="30"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Payment Gateway"
              value={settings.billing.paymentGateway}
              onChange={(value) =>
                updateSetting("billing", "paymentGateway", value)
              }
              options={[
                { value: "stripe", label: "Stripe" },
                { value: "paypal", label: "PayPal" },
                { value: "square", label: "Square" },
              ]}
            />
            <InputField
              label="Trial Period (days)"
              value={settings.billing.trialPeriod}
              onChange={(value) =>
                updateSetting("billing", "trialPeriod", value)
              }
              type="number"
              min="0"
              max="30"
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Subscription Plans"
        description="Configure subscription pricing"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Basic Plan ($)"
              value={settings.billing.subscriptionPlans.basic}
              onChange={(value) =>
                updateSetting("billing", "subscriptionPlans", {
                  ...settings.billing.subscriptionPlans,
                  basic: value,
                })
              }
              type="number"
              min="0"
            />
            <InputField
              label="Premium Plan ($)"
              value={settings.billing.subscriptionPlans.premium}
              onChange={(value) =>
                updateSetting("billing", "subscriptionPlans", {
                  ...settings.billing.subscriptionPlans,
                  premium: value,
                })
              }
              type="number"
              min="0"
            />
            <InputField
              label="Platinum Plan ($)"
              value={settings.billing.subscriptionPlans.platinum}
              onChange={(value) =>
                updateSetting("billing", "subscriptionPlans", {
                  ...settings.billing.subscriptionPlans,
                  platinum: value,
                })
              }
              type="number"
              min="0"
            />
          </div>
          <ToggleSwitch
            enabled={settings.billing.recurringBilling}
            onChange={(value) =>
              updateSetting("billing", "recurringBilling", value)
            }
            label="Recurring Billing"
            description="Enable automatic subscription renewals"
          />
        </div>
      </SettingsCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-slate-700 via-gray-700 to-slate-800 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">⚙️ Admin Settings</h1>
                <p className="text-gray-300 text-sm">
                  Configure system settings and preferences
                </p>
              </div>
              <div className="flex items-center gap-3">
                {hasChanges && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-4 h-4 bg-yellow-400 rounded-full"
                  />
                )}
                <span className="text-sm font-medium">
                  {hasChanges ? "Unsaved Changes" : "All Settings Saved"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 sticky top-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Settings Categories
              </h3>
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium text-sm">{tab.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "general" && renderGeneralSettings()}
                {activeTab === "security" && renderSecuritySettings()}
                {activeTab === "moderation" && renderModerationSettings()}
                {activeTab === "notifications" && renderNotificationSettings()}
                {activeTab === "matching" && renderMatchingSettings()}
                {activeTab === "billing" && renderBillingSettings()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Fixed Save Bar */}
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-6 left-6 right-6 z-50"
            >
              <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-gray-800">
                        You have unsaved changes
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleReset}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all duration-200"
                      >
                        Reset Changes
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                      >
                        {saving ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </div>
                        ) : (
                          "💾 Save All Settings"
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminSettings;
