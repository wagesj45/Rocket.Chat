import { Meteor } from 'meteor/meteor';
import React from 'react';

import { Info as info, APIClient } from '../../app/utils/client';
import { ServerContext } from '../contexts/ServerContext';

const absoluteUrl = (path) => Meteor.absoluteUrl(path);

const callMethod = (methodName, ...args) =>
	new Promise((resolve, reject) => {
		Meteor.call(methodName, ...args, (error, result) => {
			if (error) {
				reject(error);
				return;
			}

			resolve(result);
		});
	});

const callEndpoint = (httpMethod, endpoint, ...args) => {
	const allowedHttpMethods = ['get', 'post', 'delete'];
	if (!httpMethod || !allowedHttpMethods.includes(httpMethod.toLowerCase())) {
		throw new Error('Invalid http method provided to "useEndpoint"');
	}
	if (!endpoint) {
		throw new Error('Invalid endpoint provided to "useEndpoint"');
	}

	if (endpoint[0] === '/') {
		return APIClient[httpMethod.toLowerCase()](endpoint.slice(1), ...args);
	}

	return APIClient.v1[httpMethod.toLowerCase()](endpoint, ...args);
};

const uploadToEndpoint = (endpoint, params, formData) => {
	if (endpoint[0] === '/') {
		return APIClient.upload(endpoint.slice(1), params, formData).promise;
	}

	return APIClient.v1.upload(endpoint, params, formData).promise;
};

const getStream = (streamName, options = {}) => {
	const streamer = Meteor.StreamerCentral.instances[streamName]
		? Meteor.StreamerCentral.instances[streamName]
		: new Meteor.Streamer(streamName, options);
	return (eventName, callback) => {
		streamer.on(eventName, callback);
		return () => {
			streamer.removeListener(eventName, callback);
		};
	};
};

const contextValue = {
	info,
	absoluteUrl,
	callMethod,
	callEndpoint,
	uploadToEndpoint,
	getStream,
};

const ServerProvider = ({ children }) => (
	<ServerContext.Provider children={children} value={contextValue} />
);

export default ServerProvider;
