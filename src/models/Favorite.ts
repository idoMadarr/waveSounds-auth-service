import { Schema, model, Model, Document, ObjectId, Types } from 'mongoose';

interface FavoriteCredentials {
  user: ObjectId | string;
  track: FavoriteRepo;
}

interface FavoriteDoc extends Document {
  _id: ObjectId;
  user: ObjectId;
  repo: FavoriteRepo[];
}

interface FavoriteModel extends Model<FavoriteDoc> {
  buildRepo(user: ObjectId): void;
  addFavorite(favoriteCredentials: FavoriteCredentials): FavoriteRepo;
}

interface FavoriteRepo {
  id: string;
  title: string;
  artist: string;
  rank: number;
  image: string;
  preview: string;
}

const favoriteSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
    },
    repo: {
      type: [],
      default: [],
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

favoriteSchema.statics.buildRepo = async (user: ObjectId) => {
  const createRepo = new Favorite({ user, repo: [] });
  await createRepo.save();
};

favoriteSchema.statics.addFavorite = async (
  credentials: FavoriteCredentials
) => {
  const userFavorites = (await Favorite.findOne({
    user: credentials.user,
  })) as FavoriteDoc;

  if (!userFavorites?.repo) {
    return false;
  }

  const favoriteExist = userFavorites.repo.find(
    item => item.id === credentials.track.id
  );

  if (favoriteExist) {
    return false;
  }

  userFavorites.repo.push(credentials.track);
  await userFavorites?.save();
  return credentials.track;
};

export const Favorite = model<FavoriteDoc, FavoriteModel>(
  'Favorite',
  favoriteSchema
);
