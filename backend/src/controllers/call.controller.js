import path from 'path';
import dotenv from 'dotenv';
import callBAO from '../bao/call';
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const listAllCalls = async (req, res, next) => {
    try {
        const {
            query: { page, limit },
        } = req?.validatedInput;
        const data = await callBAO.listAllCalls({ page, limit });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const listInboundCalls = async (req, res, next) => {
    try {
        const {
            query: { page, limit },
        } = req?.validatedInput;
        const data = await callBAO.listInboundCalls({ page, limit });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const listOutboundCalls = async (req, res, next) => {
    try {
        const {
            query: { page, limit },
        } = req?.validatedInput;
        const data = await callBAO.listOutboundCalls({ page, limit });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const dialCentreAgents = async (req, res, next) => {
    try {
        const { location } = req?.validatedInput?.body;
        const data = await callBAO.dialCentreAgents({ location, user: req?.user });
        res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const acceptDial = async (req, res, next) => {
    try {
        const { dial_id: dialId } = req?.validatedInput?.body;
        const data = await callBAO.acceptDial({ dialId, user: req?.user });
        res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const endDial = async (req, res, next) => {
    try {
        const { dial_id: dialId } = req?.validatedInput?.body;
        const data = await callBAO.endDial({ dialId, user: req?.user });
        res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const updatedDialTrack = async (req, res, next) => {
    try {
        const { video_track: videoTrack, audio_track: audioTrack, dial_id: dialId } = req?.validatedInput?.body;
        const data = await callBAO.updatedDialTrack({ audioTrack, videoTrack, dialId, user: req?.user });
        res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};
