import React, {useState, useEffect} from 'react';
import {Text, Box} from 'ink';
import {execSync} from 'child_process';
import fs from 'fs';
import {Config} from './types/index.js';
import {fetchConfig, generateServerConfig} from './utils/config.js';
import {ConfigStep} from './components/config-step.js';

interface AppProps {
	type: string;
}

export default function App({type}: AppProps) {
	const [step, setStep] = useState(1);
	const [error, setError] = useState<string | null>(null);
	const [, setConfig] = useState<Config | null>(null);
	const [url, setUrl] = useState<string | null>(null);

	const steps = [
		'Fetching configuration',
		'Installing Xray',
		'Generating keys',
		'Configuring server',
		'Generating QR code',
	];

	useEffect(() => {
		const configure = async () => {
			try {
				// Step 1: Fetch config
				setStep(1);
				const configData = await fetchConfig(type);
				setConfig(configData);

				// Step 2: Install Xray
				setStep(2);
				execSync(
					'bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install --beta',
				);

				// Step 3: Generate keys and IDs
				setStep(3);
				const {pk, pub, serverIp, uuid, shortId} = generateServerConfig();

				// Step 4: Configure server
				setStep(4);
				const generatedUrl =
					type === 'tcp'
						? `vless://${uuid}@${serverIp}:${configData.port}?security=reality&sni=${configData.sni}&fp=chrome&pbk=${pub}&sid=${shortId}&type=tcp&flow=xtls-rprx-vision&encryption=none#${configData.name}`
						: `vless://${uuid}@${serverIp}:${configData.port}?type=http&security=reality&encryption=none&pbk=${pub}&fp=chrome&path=${configData.path}&sni=${configData.sni}&sid=${shortId}#${configData.name}`;

				setUrl(generatedUrl);

				// Update and save config
				const updatedConfig = {
					...configData,
					inbounds: [
						{
							...configData.inbounds[0],
							settings: {
								...configData?.inbounds[0]?.settings,
								clients: [
									{
										...configData.inbounds[0]?.settings.clients[0],
										id: uuid,
									},
								],
							},
							streamSettings: {
								...configData.inbounds[0]?.streamSettings,
								realitySettings: {
									...configData.inbounds[0]?.streamSettings.realitySettings,
									privateKey: pk,
									shortIds: [shortId],
									dest: `${configData.sni}:443`,
									serverNames: [configData.sni, `www.${configData.sni}`],
								},
							},
						},
					],
				};

				fs.writeFileSync(
					'/usr/local/etc/xray/config.json',
					JSON.stringify(updatedConfig, null, 2),
				);
				execSync('sudo systemctl restart xray');

				// Step 5: Generate QR Code
				setStep(5);
				execSync(`qrencode -s 120 -t ANSIUTF8 "${generatedUrl}"`);
				execSync(`qrencode -s 50 -o qr.png "${generatedUrl}"`);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error occurred');
			}
		};

		configure();
	}, [type]);

	return (
		<Box flexDirection="column" padding={1}>
			<Text bold color="green">
				🚀 Xray Reality Installer
			</Text>
			<Text>Type: {type.toUpperCase()}</Text>

			{steps.map((stepText, index) => (
				<ConfigStep
					key={index}
					step={stepText}
					status={
						index + 1 === step
							? 'pending'
							: index + 1 < step
							? 'success'
							: error && index + 1 === step
							? 'error'
							: 'pending'
					}
					error={index + 1 === step ? error ?? undefined : undefined}
				/>
			))}

			{url && (
				<Box marginTop={1} flexDirection="column">
					<Text bold color="green">
						✅ Configuration Completed!
					</Text>
					<Text>🔗 Generated VLESS Link:</Text>
					<Text wrap="wrap">{url}</Text>
				</Box>
			)}
		</Box>
	);
}
