// models/Location.js
import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  city: String,
  country: String,
  address: String,
  accuracy: Number, // in meters
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

locationSchema.index({ location: '2dsphere' });
locationSchema.index({ user: 1 });

const Location = mongoose.model('Location', locationSchema);

export default Location;