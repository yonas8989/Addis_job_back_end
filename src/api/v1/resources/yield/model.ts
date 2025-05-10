import { yieldSchema, IYieldDocument } from './schema';
import { model } from 'mongoose';

export const YieldModel = model<IYieldDocument>('Yield', yieldSchema);