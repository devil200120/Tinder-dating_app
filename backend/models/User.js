// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'other'],
    required: [true, 'Gender is required']
  },
  genderPreference: {
    type: [String],
    enum: ['male', 'female', 'non-binary', 'other', 'everyone'],
    default: ['everyone']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  occupation: {
    type: String,
    default: ''
  },
  education: {
    type: String,
    default: ''
  },
  interests: [{
    type: String,
    trim: true
  }],
  photos: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    city: String,
    country: String,
    address: String
  },
  preferences: {
    ageRange: {
      min: {
        type: Number,
        default: 18,
        min: 18
      },
      max: {
        type: Number,
        default: 100,
        max: 100
      }
    },
    distanceRange: {
      type: Number,
      default: 50, // km
      min: 1,
      max: 500
    },
    lookingFor: {
      type: String,
      enum: ['friendship', 'dating', 'relationship', 'casual', 'marriage'],
      default: 'dating'
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'gold', 'platinum'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: false
    }
  },
  boost: {
    isActive: {
      type: Boolean,
      default: false
    },
    expiresAt: Date,
    count: {
      type: Number,
      default: 0
    }
  },
  verified: {
    email: {
      type: Boolean,
      default: false
    },
    phone: {
      type: Boolean,
      default: false
    },
    photo: {
      type: Boolean,
      default: false
    }
  },
  verification: {
    emailToken: String,
    emailTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordExpiry: Date
  },
  stats: {
    likesGiven: {
      type: Number,
      default: 0
    },
    likesReceived: {
      type: Number,
      default: 0
    },
    superLikesGiven: {
      type: Number,
      default: 0
    },
    superLikesReceived: {
      type: Number,
      default: 0
    },
    matches: {
      type: Number,
      default: 0
    },
    profileViews: {
      type: Number,
      default: 0
    }
  },
  status: {
    isOnline: {
      type: Boolean,
      default: false
    },
    lastSeen: {
      type: Date,
      default: Date.now
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: String,
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  refreshToken: {
    type: String,
    select: false
  }
}, {
  timestamps: true
});

// Index for geospatial queries
userSchema.index({ location: '2dsphere' });
userSchema.index({ email: 1 });
userSchema.index({ age: 1 });
userSchema.index({ gender: 1 });
userSchema.index({ 'subscription.plan': 1 });
userSchema.index({ createdAt: -1 });

// Calculate age from date of birth
userSchema.pre('save', function(next) {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    this.age = age;
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user has active subscription
userSchema.methods.hasActiveSubscription = function() {
  return this.subscription.isActive && 
         this.subscription.endDate && 
         new Date(this.subscription.endDate) > new Date();
};

// Check if user has active boost
userSchema.methods.hasActiveBoost = function() {
  return this.boost.isActive && 
         this.boost.expiresAt && 
         new Date(this.boost.expiresAt) > new Date();
};

const User = mongoose.model('User', userSchema);

export default User;