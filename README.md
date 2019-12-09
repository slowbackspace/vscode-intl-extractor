# IntlExtractor

Extracts text selection to an object compatible with react-intl message objects.

## Extension Settings

This extension exposes the following settings:

-   `intlExtractor.messagesFilePath`: Path to the file where a new message will be inserted. Path is relative to the workspace's root. Currently only JSON file is supported.
-   `intlExtractor.messageComponent`: Name of the message component (default is `FormattedMessage`)
-   `intlExtractor.ignoreTokens`: List of words that will be excluded when generating the message ID (default is `['a', 'an', 'the', '.', ',']`).

## Known Issues

## Release Notes

### 0.1.0

Initial release
