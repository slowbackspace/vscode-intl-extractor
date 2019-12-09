# IntlExtractor

VSCode extension for extracting strings to react-intl compatible messages objects.

## Extension Settings

This extension exposes the following settings:

-   `intlExtractor.messagesFilePath`: Path to the file where a new message will be inserted. Path is relative to the workspace's root. Currently only JSON or javascript and typescript files with `defineMessages` function are supported.
-   `intlExtractor.messageComponent`: Name of the message component (default is `FormattedMessage`)
-   `intlExtractor.messageIdPrefix`: Prefix used for generated IDs of messages
-   `intlExtractor.ignoreTokens`: List of words that will be excluded when generating the message ID (default is `['a', 'an', 'the', '.', ',']`).
-   `intlExtractor.trailingComma`: Specifies whether to append trailing comma after a message object. Applies only with specified `messagesFilePath` leading to javascript/typescript file.

## Known Issues

## Release Notes

### 0.1.0

Initial release
